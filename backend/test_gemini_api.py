#!/usr/bin/env python
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.conf import settings

print("Testing Gemini API directly...")
print()

try:
    import google.generativeai as genai
    
    api_key = settings.GEMINI_API_KEY
    print(f"API Key length: {len(api_key) if api_key else 0}")
    print(f"API Key starts with: {api_key[:10] if api_key else 'NOT SET'}...")
    print()
    
    genai.configure(api_key=api_key)
    
    print("Attempting to embed a test string...")
    from langchain_google_genai import GoogleGenerativeAIEmbeddings
    
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/embedding-001",
        google_api_key=api_key,
    )
    
    # Test with a short string
    print("Embedding 'test'...")
    result = embeddings.embed_query("test")
    print(f"✓ Embedding successful! Vector dimension: {len(result)}")
    
except Exception as e:
    print(f"✗ Error: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()
