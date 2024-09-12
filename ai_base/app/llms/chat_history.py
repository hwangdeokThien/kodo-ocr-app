from typing import Sequence
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.messages.base import BaseMessage
from database import get_chat_history_collection

class ChatMessageHistory(BaseChatMessageHistory):
    def __init__(self, session_id: str, prompt_type: str):
        self.session_id = session_id
        self.prompt_type = prompt_type

    @property
    def messages(self) -> Sequence[BaseMessage]:
        # Get the correct collection based on the prompt type
        collection = get_chat_history_collection(self.prompt_type)
        session = collection.find_one({"session_id": self.session_id})
        if session:
            return [
                HumanMessage(content=msg["content"]) if msg["role"] == "human" else AIMessage(content=msg["content"])
                for msg in session["messages"]
            ]
        return []

    def add_messages(self, messages: Sequence[BaseMessage]) -> None:
        all_messages = messages.copy()
        serialized_messages = [
            {"role": "human", "content": message.content} if isinstance(message, HumanMessage) else {"role": "ai", "content": message.content}
            for message in all_messages
        ]
        # Get the correct collection based on the prompt type
        collection = get_chat_history_collection(self.prompt_type)
        collection.update_one(
            {"session_id": self.session_id},
            {"$set": {"messages": serialized_messages}},
            upsert=True
        )

    def clear(self) -> None:
        # Get the correct collection based on the prompt type
        collection = get_chat_history_collection(self.prompt_type)
        collection.update_one(
            {"session_id": self.session_id},
            {"$set": {"messages": []}}
        )

    async def aget_messages(self) -> Sequence[BaseMessage]:
        return self.messages

    async def aadd_messages(self, messages: Sequence[BaseMessage]) -> None:
        self.add_messages(messages)

    async def aclear(self) -> None:
        self.clear()

def get_session_history(session_id: str, prompt_type: str):
    return ChatMessageHistory(session_id, prompt_type)