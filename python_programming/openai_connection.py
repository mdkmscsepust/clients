import ollama

response = ollama.chat(
    model='llama3',
    messages=[
        {'role': 'user', 'content': 'Just give an example of a Python program that prints "Hello, World!"'}
    ]
)

print(response['message']['content'])
