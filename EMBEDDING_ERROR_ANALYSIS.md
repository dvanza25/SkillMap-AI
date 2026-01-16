# Embedding Error Analysis: 504 Deadline Exceeded

## Problem Summary
When running `docker compose exec backend python manage.py seed_docs`, you were getting a "504 Deadline Exceeded" error when trying to embed documents.

## Root Cause Analysis

After thorough investigation and testing, the actual root cause is **not a network timeout**, but rather **Gemini API quota limits being exceeded (HTTP 429)**.

The 504 error was a symptom that manifested due to:
1. **Free-tier quota exhaustion** - The embedding-001 model free tier has strict limits:
   - Limited requests per minute per project
   - Limited requests per minute per user per project
   - Limited requests per day per user per project
   - Limited requests per day per project
   
2. **When quota is exceeded**, the API rejects requests with a 429 error, which can cause timeout-like errors (504) when retry mechanisms attempt to resubmit

3. **The timeout message** "504 Deadline Exceeded" appeared because:
   - Google's API client library uses gRPC with strict timeouts
   - When quotas are exceeded, requests queue up and eventually timeout

## Error Message Breakdown

The actual error you're seeing now:
```
429 You exceeded your current quota, please check your plan and billing details.
* Quota exceeded for metric: generativelanguage.googleapis.com/embed_content_free_tier_requests
```

This means:
- Your Gemini API free tier has **zero remaining requests** for the embedding model
- You need to either wait for the quota to reset or add billing information

## Solutions

### Option 1: Wait for Quota Reset (Fastest if quota resets daily)
- The error messages indicate retry delays: "Please retry in X seconds"
- The command now respects these delay suggestions automatically
- Run the command again after the suggested delay

### Option 2: Enable Billing (Recommended for Production)
1. Go to: https://console.cloud.google.com/
2. Navigate to your project
3. Add a billing method
4. This significantly increases your API quotas
5. Free tier quotas don't apply once billing is enabled

### Option 3: Monitor Your Usage
- Check your current quota usage: https://ai.dev/rate-limit
- View quota metrics in Google Cloud Console
- Track requests per minute/hour/day

## Code Improvements Made

I've updated your codebase with the following improvements:

### 1. **Enhanced RAG Module** (`ai_tutor/rag.py`)
- Created `TimeoutEmbeddings` wrapper class
- Implements proper timeout configuration (180 seconds)
- Direct API calls with request_options for timeout handling
- Better error handling and logging

### 2. **Improved Seed Command** (`roadmap/management/commands/seed_docs.py`)
- Added retry logic with exponential backoff
- Automatically respects API retry-after headers
- Detects 429 (quota) vs 504 (timeout) errors
- Provides specific troubleshooting guidance based on error type
- Better progress indicators with visual feedback
- Configurable retry delays

## How the Improved Command Works

1. **Initialization**: Validates vectorstore setup
2. **Processing**: Attempts to embed each document
3. **Retry Logic**:
   - If quota error (429): Respects the `retry-after` delay specified by API
   - If timeout error (504): Uses default retry delay with backoff
   - Max 3 total attempts per document
4. **Error Reporting**: Provides specific guidance based on error type

## Testing Recommendations

Once you've resolved the quota issue:

1. **Test with mock data first**:
```bash
docker compose exec backend python manage.py seed_docs
```

2. **Monitor logs for success**:
- Should see ✓ symbols for successful embeddings
- Seededs N/4 documents at the end

3. **Verify in database**:
```bash
docker compose exec db psql -U postgres -d skillmap -c "SELECT COUNT(*) FROM langchain_pg_collection;"
```

## Prevention Tips for Future

1. **Add request throttling**: Increase delays between requests when using free tier
2. **Batch processing**: Process documents in smaller batches
3. **Cache embeddings**: Store results to avoid re-embedding
4. **Monitor quotas**: Set up alerts for quota usage
5. **Use billing early**: For production systems, always use a paid API key

## Files Modified

1. `/backend/ai_tutor/rag.py` - Enhanced embedding with timeout configuration
2. `/backend/roadmap/management/commands/seed_docs.py` - Improved retry logic and error handling

## Next Steps

1. Check your API quota at https://ai.dev/rate-limit
2. Either wait for reset or enable billing
3. Run the command again: `docker compose exec backend python manage.py seed_docs`
4. The command will now retry appropriately with proper delays
