#!/usr/bin/env python
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.conf import settings
import google.api_core.gapic_v1.method

print("Testing Gemini API with increased timeout...")
print()

try:
    import google.generativeai as genai
    from google.api_core.gapic_v1 import client_info
    from google.api_core import retry
    
    api_key = settings.GEMINI_API_KEY
    print(f"API Key configured: {'✓' if api_key else '✗'}")
    
    genai.configure(api_key=api_key)
    
    # Check the GenerativeModel
    model = genai.GenerativeModel('models/embedding-001')
    print(f"Model loaded: {model.model_name}")
    
    # Try direct API call with retry configuration
    print("\nAttempting to embed via GenerativeModel...")
    
    # Create custom retry settings with longer timeout
    custom_retry = retry.Retry(
        initial=2,
        maximum=60,
        multiplier=2,
        predicate=retry.if_transient_error,
        deadline=300,  # 5 minutes timeout
    )
    
    # However, we need to check what parameters batch_embed_contents accepts
    from google.ai.generativelanguage_v1beta import content
    
    request = content.BatchEmbedContentsRequest(
        model=f"models/embedding-001",
        requests=[
            content.EmbedContentRequest(
                model=f"models/embedding-001",
                content=content.Content(parts=[content.Part(text="test")])
            )
        ]
    )
    
    print("Request created, attempting API call...")
    
except Exception as e:
    print(f"Error: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()
