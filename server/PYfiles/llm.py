from langchain_community.document_loaders import JSONLoader # type: ignore
from langchain_text_splitters import RecursiveCharacterTextSplitter # type: ignore
from langchain_text_splitters import RecursiveJsonSplitter # type: ignore
import json
from pathlib import Path
import getpass
import os
from dotenv import load_dotenv  # type: ignore
from langchain_community.vectorstores import FAISS # type: ignore
# from pprint import pprint
# import requests
from langchain_google_genai import GoogleGenerativeAIEmbeddings  # type: ignore
import google.generativeai as genai # type: ignore
from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.prompts import PromptTemplate
from langchain.chains.question_answering import load_qa_chain
from langchain_google_genai import ChatGoogleGenerativeAI





load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

#########USE OF JSONLOADER #########
file_path='./data.json'
data = json.loads(Path(file_path).read_text())
# pprint(data)


#########USE OF JSONSPLITTER #########
# json_data = requests.get(data).json()
splitter = RecursiveJsonSplitter(max_chunk_size=300)
json_data = data
json_chunks = splitter.split_json(json_data=json_data)
docs = splitter.create_documents(texts=[json_data])
texts = splitter.split_text(json_data=json_data)
# print(texts[0])
# print(texts[1]) 


####USING VECTOR STORING#############
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
vector_store=FAISS.from_texts(texts,embeddings)
vector_store.save_local("faiss_index")




######################################################## PDF CONTENT EXTRACTION ################################################

# Extracting all the text from the pdfs
def get_pdf_text(pdf_docs):
    text = ""
    for pdf in pdf_docs:
        pdf_reader = PdfReader(pdf)
        for page in pdf_reader.pages:
            text += page.extract_text()
    return text


# Splitting the text into chunks
def get_text_chunks(text):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=10000, chunk_overlap=1000)
    chunks=text_splitter.split_text(text)
    return chunks

# Getting the vector store
def get_vector_store(text_chunks):
   
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")



    vector_store=FAISS.from_texts(text_chunks,embeddings)
    vector_store.save_local("faiss_index")


############################### CONVERSATIONAL CHAIN ####################

# Getting the conversational chain
def get_conversational_chain():
    prompt_template="""
    Answer the question as detailed as possible from the provided context, make sure to provide all the details, if the answer is not in
    provided context just say, "answer is not available in the context", don't provide the wrong answer\n\n
    Context:\n {context}?\n
    Question: \n{question}\n

    Answer:
    """
    model=ChatGoogleGenerativeAI(model="gemini-pro", temperature=0.5)

    prompt=PromptTemplate(template=prompt_template, input_variables=["context","question"])
    chain=load_qa_chain(model,chain_type="stuff",prompt = prompt)
    return chain


# User input
def user_input(user_question):
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")


    new_db=FAISS.load_local("faiss_index",embeddings)
    docs=new_db.similarity_search(user_question)

    chain= get_conversational_chain()

    response = chain(
            {"input_documents":docs, "question": user_question}
            , return_only_outputs=True)

    print(response)
