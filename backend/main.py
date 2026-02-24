from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

# ✅ Correct imports for Render production
from backend.routes.export import router as export_router
from backend.routes import dashboard, leads, pipeline, documents, risk, assistant

import asyncio
import json

app = FastAPI(title="Finance AI Backend", version="1.0")

# ================= CORS =================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # demo only — restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= ROUTERS =================
app.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
app.include_router(leads.router, prefix="/leads", tags=["Leads"])
app.include_router(pipeline.router, prefix="/pipeline", tags=["Pipeline"])
app.include_router(documents.router, prefix="/documents", tags=["Documents"])
app.include_router(risk.router, prefix="/risk", tags=["Risk"])
app.include_router(assistant.router, prefix="/assistant", tags=["AI Assistant"])
app.include_router(export_router, prefix="/api", tags=["MIS Export"])

# ================= ROOT =================
@app.get("/")
def root():
    return {
        "message": "Finance AI Backend Running",
        "modules": [
            "Dashboard",
            "Leads",
            "Pipeline",
            "Documents",
            "Risk",
            "AI Assistant",
            "MIS Export",
            "WebSocket Live Dashboard",
        ],
    }

# ================= WEBSOCKET MANAGER =================
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, data: dict):
        dead_connections = []
        for connection in self.active_connections:
            try:
                await connection.send_text(json.dumps(data))
            except:
                dead_connections.append(connection)

        for dc in dead_connections:
            self.disconnect(dc)

manager = ConnectionManager()

# ================= LIVE DASHBOARD WEBSOCKET =================
@app.websocket("/ws/dashboard")
async def websocket_dashboard(websocket: WebSocket):
    await manager.connect(websocket)

    try:
        while True:
            await asyncio.sleep(3)

            live_data = {
                "stats": {
                    "total_leads": 13,
                    "applications": 8,
                    "approval_rate": 25,
                    "avg_risk_score": 64,
                }
            }

            await manager.broadcast(live_data)

    except WebSocketDisconnect:
        manager.disconnect(websocket)

# ================= HEALTH CHECK =================
@app.get("/health")
def health_check():
    return {"status": "ok", "service": "finance-ai-backend"}
