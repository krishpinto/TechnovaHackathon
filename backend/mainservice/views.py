import math
import random
from django.http import JsonResponse
from .service import get_vector_store, get_llm, get_redis_client, initialize_environment, get_project_store, get_meeting_store
import logging
import json
from datetime import datetime
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import os
from moviepy.video.io.VideoFileClip import VideoFileClip
import speech_recognition as sr
from transformers import T5ForConditionalGeneration, T5Tokenizer
model = T5ForConditionalGeneration.from_pretrained("google-t5/t5-small")
tokenizer = T5Tokenizer.from_pretrained("google-t5/t5-small")

def summarize(text):
    inputs = tokenizer("summarize: " + text, return_tensors="pt", max_length=1024, truncation=True)
    outputs = model.generate(inputs["input_ids"], max_length=150)
    return tokenizer.decode(outputs[0], skip_special_tokens=True)



logger = logging.getLogger(__name__)

DEFAULT_QUERY = "Suggest optimized workflow considering employee roles, projects, and meeting history"
HISTORY_KEY = "workflow:history"
MAX_HISTORY = 5

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
_, database, _, _ = initialize_environment()

@csrf_exempt
def upload_video(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=400)

    if "video" not in request.FILES:
        return JsonResponse({"error": "No video file provided"}, status=400)

    video_file = request.FILES["video"]
    video_path = os.path.join(UPLOAD_FOLDER, video_file.name)
    audio_path = os.path.join(UPLOAD_FOLDER, "audio.wav")

    # Save video
    path = default_storage.save(video_path, ContentFile(video_file.read()))

    try:
        # Extract audio from video
        video = VideoFileClip(video_path)
        video.audio.write_audiofile(audio_path)
        video.close()  # Ensure the video file is closed

        # Convert audio to text
        recognizer = sr.Recognizer()
        with sr.AudioFile(audio_path) as source:
            audio_data = recognizer.record(source)
            transcription = recognizer.recognize_google(audio_data)
        summary = summarize(transcription)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    try:
    # Create document
        result = database.create_document(
        database_id='67948c8e001f38c2bb1b',
        collection_id='67957e96002d76018877',
        document_id='unique()',
        data={
            "projects-id":f"{random.randint(1000000,500000)}",
            'meeting-summary':f"{summary}",



        }
    )
        print(f"Document ID: {result['$id']}")
        return JsonResponse({"transcription": transcription})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


def get_optimized_workflow(request):
    """Handle user query with historical context including meetings"""
    try:
        redis = get_redis_client()
        user_query = request.GET.get('query', '').strip()
        use_default = not bool(user_query)
        final_query = user_query or DEFAULT_QUERY
        
        # Get historical context
        raw_history = redis.lrange(HISTORY_KEY, 0, MAX_HISTORY-1)
        history_context = "\n".join(
            f"Previous optimization {i+1}:\nQuery: {json.loads(entry)['query']}\n"
            f"Solution: {json.loads(entry)['response']}"
            for i, entry in enumerate(raw_history[::-1])
        )

        # Get context from all data stores
        user_store = get_vector_store()
        project_store = get_project_store()
        meeting_store = get_meeting_store()
        
        # Search across all stores
        user_results = user_store.similarity_search(final_query, k=2)
        project_results = project_store.similarity_search(final_query, k=2)
        meeting_results = meeting_store.similarity_search(final_query, k=2)

        # Build context strings
        employee_context = "\n".join(
            f"Employee Role: {doc.metadata['des_position']}\n"
            f"Schedule: {doc.metadata['daily-schedule']}\n"
            f"Department: {doc.metadata['department']}"
            for doc in user_results
        )

        project_context = "\n".join(
            f"Project: {doc.metadata['name']}\n"
            f"Status: {doc.metadata['status']}\n"
            f"Team: {doc.metadata['team']}\n"
            f"Deadline: {doc.metadata['deadline']}"
            for doc in project_results
        )

        meeting_context = "\n".join(
            f"Attendees: {doc.metadata['participants']}\n"
            f"Summary: {doc.page_content}\n"
            for doc in meeting_results
        )
        print(meeting_context,"\n",employee_context,"\n",project_context,
              "\nTHE PROJECT CONTEXT", project_context)
        # Build enhanced prompt with meeting integration
        prompt = f"""Optimization History:
{history_context}

Current Request:
{final_query}

Employee Context:
{employee_context}

Project Context:
{project_context}

Meeting Context:
{meeting_context}

Analyze and provide recommendations considering:
1. give suggestions for each employee to improve their performance based on their role project and meeting data
2. Project suitability based on skills and meeting outcomes
3. Action items from recent meetings affecting workflow
4. Team collaboration opportunities from meeting history
5. Project advancement strategies based on decisions made

Provide specific, actionable steps with meeting references where applicable."""

        # Get and store response
        llm = get_llm()
        response = llm.invoke(prompt)
        
        # Store interaction history
        history_entry = {
            "timestamp": datetime.now().isoformat(),
            "query": final_query,
            "response": response.content
        }
        redis.lpush(HISTORY_KEY, json.dumps(history_entry))
        redis.ltrim(HISTORY_KEY, 0, MAX_HISTORY-1)

        return JsonResponse({
            "gemini_response": response.content,
            "used_default": use_default
        })
        
    except Exception as e:
        logger.error(f"Workflow error: {str(e)}", exc_info=True)
        return JsonResponse({
            "error": "Optimization failed. Please try again later.",
            "details": str(e)
        }, status=500)