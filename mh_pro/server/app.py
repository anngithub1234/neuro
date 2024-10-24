from flask import Flask, request, jsonify
import tensorflow as tf
import pickle
import numpy as np
from flask_cors import CORS
from lime.lime_text import LimeTextExplainer  # Import LIME for text explanations

app = Flask(__name__)
CORS(app)  # Allow CORS for cross-origin requests

# Load the model and tokenizer
model = tf.keras.models.load_model('text_classification_model.keras')
with open('tokenizer.pkl', 'rb') as handle:
    tokenizer = pickle.load(handle)

# Define the class names and advice for each class
class_names = ['Suicidal', 'Stress', 'Trauma', 'Anxiety', 'Depression', 'Normal']
advice = {
    'Suicidal': "If you're experiencing suicidal thoughts, please reach out immediately to a mental health professional, trusted friend, or family member. Suicidal thoughts are a sign that you need support, and you don’t have to handle this alone. In moments of crisis, contacting a helpline or going to a safe place is crucial. It’s also important to create a safety plan with a therapist to help you navigate these difficult moments and work toward recovery.",
    
    'Stress': "Stress can build up over time, so it’s essential to actively manage it. Techniques such as deep breathing, progressive muscle relaxation, or mindfulness meditation can help regulate your stress response. Establishing clear boundaries in your daily life and incorporating regular breaks can also prevent burnout. If stress becomes overwhelming, cognitive-behavioral strategies from a therapist can help you reframe stressful thoughts and identify effective coping mechanisms.",
    
    'Trauma': "Healing from trauma is a process that requires patience and self-compassion. Therapy approaches like EMDR (Eye Movement Desensitization and Reprocessing) or trauma-focused cognitive-behavioral therapy can help you process traumatic experiences safely. In the meantime, grounding techniques, mindfulness, and establishing a sense of safety in your environment are important steps in recovery. Give yourself the time and space to heal, and work closely with a trauma-informed therapist for support.",
    
    'Anxiety': "Managing anxiety involves understanding triggers and learning effective coping strategies. Cognitive-behavioral therapy (CBT) can be a powerful tool to reframe anxious thoughts, while mindfulness and grounding exercises help you stay present in the moment. Breaking down tasks into smaller, achievable steps can reduce feelings of overwhelm. If anxiety is persistent, collaborating with a therapist will provide you with tailored techniques to manage and reduce its impact on daily life.",
    
    'Depression': "Depression can feel isolating, but support is available. Speaking with a therapist can help challenge negative thought patterns and encourage you to re-engage with life. Cognitive-behavioral therapy (CBT) and other modalities can provide practical tools to address depressive symptoms. Engaging in activities that once brought joy, even in small doses, along with regular exercise, sunlight, and social connections, can help improve mood. It’s important to reach out to trusted individuals for support and consider professional treatment options if symptoms persist.",
    
    'Normal': "It sounds like things are going well for you, and maintaining your mental health should remain a priority. Regular self-care routines, including mindfulness practices, exercise, and emotional check-ins, can help sustain this balance. Even during stable periods, continued reflection and mental health maintenance are important to stay resilient and prepared for future challenges. Keep up the great work in nurturing your well-being."
}


# Create a LimeTextExplainer object for explaining the predictions
explainer = LimeTextExplainer(class_names=class_names)

# Define a function for making predictions and providing LIME explanations
def predict_text(text):
    # Preprocess the text using the tokenizer
    sequences = tokenizer.texts_to_sequences([text])
    # Pad sequences to ensure they are the correct input size for the model
    padded_sequences = tf.keras.preprocessing.sequence.pad_sequences(sequences, maxlen=100)  # Adjust maxlen if needed
    
    # Make predictions
    predictions = model.predict(padded_sequences)
    
    # Return the predicted class or probability
    predicted_class = np.argmax(predictions, axis=1)[0]
    class_name = class_names[predicted_class]
    class_advice = advice[class_name]
    
    return class_name, class_advice, predictions

# Define a wrapper function to help explain the model's predictions with LIME
def predict_proba(text_list):
    # This function is necessary for LIME to get the model's probabilities for each class
    sequences = tokenizer.texts_to_sequences(text_list)
    padded_sequences = tf.keras.preprocessing.sequence.pad_sequences(sequences, maxlen=100)
    return model.predict(padded_sequences)

# Define the Flask route for making predictions with explanations
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get the input text from the request
        data = request.get_json()
        if 'text' not in data:
            return jsonify({'error': 'No text field provided in JSON'}), 400
        
        text = data['text']
        
        # Get the prediction and class advice from the model
        class_name, class_advice, predictions = predict_text(text)
        
        # Use LIME to explain the prediction
        explanation = explainer.explain_instance(text, predict_proba, num_features=6, top_labels=1)
        exp_list = explanation.as_list(label=np.argmax(predictions))
        
        # Prepare the LIME explanation as a human-readable string
        explanation_str = " | ".join([f"{feature}: {weight:.2f}" for feature, weight in exp_list])

        # Convert predictions to a list of probabilities for each class
        prediction_probs = {class_names[i]: float(predictions[0][i]) for i in range(len(class_names))}

        # Return the result as JSON, including the LIME explanation and prediction probabilities
        return jsonify({
            'predicted_class': class_name,
            'advice': class_advice,
            'explanation': explanation_str,
            'prediction_probs': prediction_probs  # Return probabilities for each class
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
