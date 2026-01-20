package infra

import (
	"log"
	"sync"

	"myapp/domain"

	"github.com/gorilla/websocket"
)

type WebSocketEventAdapter struct {
	conns map[string]*websocket.Conn
	mu    sync.RWMutex
}

func NewWebSocketEventAdapter() *WebSocketEventAdapter {
	return &WebSocketEventAdapter{
		conns: make(map[string]*websocket.Conn),
	}
}

// Add a connection for a user
func (w *WebSocketEventAdapter) AddConnection(userID string, conn *websocket.Conn) {
	w.mu.Lock()
	defer w.mu.Unlock()
	w.conns[userID] = conn
}

// Remove a connection for a user
func (w *WebSocketEventAdapter) RemoveConnection(userID string) {
	w.mu.Lock()
	defer w.mu.Unlock()
	delete(w.conns, userID)
}

// Publish sends an event to a specific user
func (w *WebSocketEventAdapter) Publish(id string, event domain.EventType, message string) error {
	log.Println("Publish:", id, event, message)

	w.mu.RLock()
	conn := w.conns[id]
	w.mu.RUnlock()

	if conn == nil {
		return nil
	}

	msg := map[string]string{
		"event":   string(event),
		"message": string(message),
	}

	return conn.WriteJSON(msg)
}

// Broadcast sends an event to all users
func (w *WebSocketEventAdapter) Broadcast(event domain.EventType) error {
	w.mu.RLock()
	defer w.mu.RUnlock()

	msg := map[string]string{
		"event": string(event),
	}

	for _, conn := range w.conns {
		_ = conn.WriteJSON(msg)
	}

	return nil
}
