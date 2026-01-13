# IMPORTANT:
# LangChain imports are intentionally INSIDE the function
# to avoid crashing Django at startup.

CONNECTION_STRING = "postgresql+psycopg2://postgres:postgres@db:5432/skillmap"


def get_qa_chain():
    """
    Get QA chain with proper error handling for different LangChain versions.
    """
    try:
        # Try the newer LangChain approach (0.1.0+)
        from langchain.chains.retrieval_qa.base import RetrievalQA
    except ImportError:
        try:
            # Try langchain_community approach
            from langchain_community.chains import RetrievalQA
        except ImportError:
            # Last resort - try the old way
            from langchain.chains import RetrievalQA
    
    from langchain_openai import ChatOpenAI, OpenAIEmbeddings
    from langchain_community.vectorstores.pgvector import PGVector

    embeddings = OpenAIEmbeddings()

    vectorstore = PGVector(
        collection_name="skillmap_docs",
        connection_string=CONNECTION_STRING,
        embedding_function=embeddings,
    )

    retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

    llm = ChatOpenAI(
        temperature=0,
        model="gpt-3.5-turbo",
    )

    return RetrievalQA.from_chain_type(
        llm=llm,
        retriever=retriever,
        chain_type="stuff",
    )
