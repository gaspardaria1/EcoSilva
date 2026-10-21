# app/ai/agent.py
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_classic.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from app.ai.tools import (
    query_trees_tool,
    generate_chart_tool,
    generate_map_tool,
    detect_anomalies_tool,
    prompt_coach_tool,
)
from app.ai.prompts.system import get_system_prompt
from app.ai.memory import get_chat_history
from app.config import settings


def create_forestguard_agent(
    session_id: str,
    user_level: str = "L0",
) -> AgentExecutor:
    """
    Create a ForestGuard AI agent for a user session.
    Uses Gemini 1.5 Pro with tool calling.
    """

    llm = ChatGoogleGenerativeAI(
        model="gemini-1.5-pro",
        google_api_key=settings.gemini_api_key,
        temperature=0.3,
        streaming=True,
        convert_system_message_to_human=True,  # Gemini requirement
    )

    tools = [
        query_trees_tool,
        generate_chart_tool,
        generate_map_tool,
        detect_anomalies_tool,
        prompt_coach_tool,
    ]

    system_prompt = get_system_prompt(user_level=user_level)

    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        MessagesPlaceholder(variable_name="chat_history"),
        ("human", "{input}"),
        MessagesPlaceholder(variable_name="agent_scratchpad"),
    ])

    agent = create_tool_calling_agent(llm, tools, prompt)

    chat_history = get_chat_history(session_id)

    executor = AgentExecutor(
        agent=agent,
        tools=tools,
        verbose=True,
        handle_parsing_errors=True,
        max_iterations=5,
    )

    return executor, chat_history
