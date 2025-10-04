from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

from routers.info_route import router as info_router
from routers.trains_route import router as trains_router

app.include_router(info_router)
app.include_router(trains_router)


@app.on_event("startup")
async def startup_event():
    pass

@app.on_event("shutdown")
async def shutdown_event():
    """Close database connection on shutdown"""
    pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
# uv uvicorn main:app --host", "0.0.0.0", "--port", "8080