from .chat_history import get_session_history
from .prompt_setup import create_chain, create_user_prompt
from langchain_core.messages import HumanMessage
from langchain_core.runnables.history import RunnableWithMessageHistory

if __name__ == "__main__":
    prompt_type = "content_creator"
    chain = create_chain(prompt_type=prompt_type)

    with_message_history = RunnableWithMessageHistory(
        chain,
        lambda session_id: get_session_history(session_id, prompt_type),
        input_messages_key="messages",
    )

    config = {"configurable": {"session_id": "s1"}}
    session_history = get_session_history("s1", prompt_type)

    if session_history.messages:
        print("Chat History:")
        for message in session_history.messages:
            role = "You" if isinstance(message, HumanMessage) else "Chatbot"
            print(f"{role}: {message.content}")
        print("\n--- Continue previous conversation ---\n")
    else:
        print("No previous chat history found. Starting a new conversation...\n")


    while True:
        print("\n================ User input ================")
        user_message = create_user_prompt(prompt_type)

        response = with_message_history.invoke(
            {
                "messages": session_history.messages + ([user_message] if user_message else []),
            },
            config=config,
        )

        print("\n================ Chatbot reply ================")
        print(response.content)
        print("===============================================\n")
