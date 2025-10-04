#!/usr/bin/env python3
"""
Test script for Ollama integration
"""
import requests
import json

def test_ollama_direct():
    """Test direct Ollama API call"""
    print("Testing direct Ollama API call...")
    
    url = "http://localhost:11434/api/generate"
    data = {
        "model": "gemma3",
        "prompt": "Jak technologia może pomóc pasażerom w unikaniu opóźnień?",
        "stream": False
    }

    try:
        response = requests.post(url, json=data)
        result = response.json()
        print("✅ Direct Ollama API call successful!")
        print(f"Response: {result['response']}")
        return True
    except requests.exceptions.ConnectionError:
        print("❌ Ollama service is not running on localhost:11434")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_fastapi_endpoint():
    """Test FastAPI endpoint"""
    print("\nTesting FastAPI endpoint...")
    
    try:
        # Test the new ollama-prompt endpoint
        response = requests.get("http://localhost:8000/info/ollama-prompt", 
                              params={"prompt": "Jak technologia może pomóc pasażerom w unikaniu opóźnień?"})
        
        if response.status_code == 200:
            print("✅ FastAPI ollama-prompt endpoint working!")
            print(f"Response: {response.text}")
            return True
        else:
            print(f"❌ FastAPI endpoint error: {response.status_code} - {response.text}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ FastAPI server is not running on localhost:8000")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Testing Ollama integration...")
    
    # Test direct Ollama API
    ollama_ok = test_ollama_direct()
    
    # Test FastAPI endpoint
    fastapi_ok = test_fastapi_endpoint()
    
    if ollama_ok and fastapi_ok:
        print("\n🎉 All tests passed! Ollama integration is working correctly.")
    else:
        print("\n⚠️  Some tests failed. Please check the error messages above.")
