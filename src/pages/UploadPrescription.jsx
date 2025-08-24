// src/pages/UploadPrescription.jsx
import React, { useState, useRef } from 'react';
import { toast } from 'sonner'; // Changed from react-hot-toast to sonner
import { UploadCloud, ScanLine, Trash2, Pill, Calendar, User, AlertTriangle, Info, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// --- Helper function to convert image file to Gemini's required base64 format ---
const fileToGenerativePart = async (file) => {
    const base64EncodedDataPromise = new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
};

// --- Child Components for Displaying Structured Prescription Data ---
// These components create the detailed view once the AI has analyzed the image.

const PrescriptionHeader = ({ clinic }) => (
    <div className="text-center p-6 bg-slate-800 text-white rounded-t-xl">
        <h1 className="text-2xl sm:text-3xl font-bold">{clinic.name || "Clinic Not Found"}</h1>
        <p className="text-lg text-slate-300 mt-1">{clinic.doctor?.name || "Doctor Not Found"}</p>
        <p className="text-sm text-slate-400">{clinic.doctor?.qualifications || ""}</p>
    </div>
);

const PatientInfo = ({ patient, date }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 border-b border-slate-200">
        <div>
            <div className="flex items-center text-slate-500">
                <User className="w-4 h-4 mr-2" />
                <h3 className="font-semibold text-slate-800">Patient Details</h3>
            </div>
            <p className="text-lg mt-1">{patient.name || 'N/A'}</p>
            <p className="text-slate-600">{`Age: ${patient.age || 'N/A'}, Gender: ${patient.gender || 'N/A'}`}</p>
        </div>
        <div className="md:text-right">
            <div className="flex items-center text-slate-500 md:justify-end">
                <Calendar className="w-4 h-4 mr-2" />
                <h3 className="font-semibold text-slate-800">Date Issued</h3>
            </div>
            <p className="text-lg mt-1">{date ? new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}</p>
        </div>
    </div>
);

const MedicationCard = ({ med }) => (
    <div className="bg-white p-4 rounded-lg border border-slate-200 hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center mb-2">
            <Pill className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0" />
            <div>
                <h4 className="font-bold text-lg text-slate-800">{med.name}</h4>
                {med.purpose && <p className="text-sm text-slate-500">{med.purpose}</p>}
            </div>
        </div>
        <p className="text-slate-700 font-medium pl-9">{med.dosage}</p>
        {med.duration && <p className="text-sm text-blue-600 font-semibold pl-9 mt-1">{`Duration: ${med.duration}`}</p>}
    </div>
);

const ExplanationDisplay = ({ explanation, isLoading }) => {
    if (isLoading) {
        return <div className="text-center p-6 text-slate-600 font-medium flex items-center justify-center"><Sparkles className="w-5 h-5 mr-2 animate-pulse" />Generating simple explanation...</div>;
    }
    if (!explanation) return null;
    return (
        <div className="mt-6 p-6 border rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 shadow-inner">
            <h2 className="text-xl font-semibold mb-3 text-slate-800 flex items-center"><Sparkles className="w-5 h-5 mr-2 text-indigo-500" />Simplified Explanation</h2>
            <div className="prose prose-slate max-w-none text-slate-800">
                {explanation.split('\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            </div>
        </div>
    );
};

// --- Main Application Component ---
const UploadPrescription = () => { // Renamed from App to UploadPrescription
    // State for managing the entire application
    const [prescription, setPrescription] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [isExplaining, setIsExplaining] = useState(false);
    const [explanation, setExplanation] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate(); // Hook for navigation

    // Reset state when a new file is uploaded or removed
    const resetState = () => {
        setPrescription(null);
        setExplanation('');
        setIsExplaining(false);
    };

    // Handler for selecting a file
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            resetState();
            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file));
            toast.success(`File "${file.name}" selected.`); // Using sonner toast
        }
    };
    
    // Handler for removing the selected image
    const handleRemoveImage = () => {
        resetState();
        setSelectedFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        toast.success('Image removed.'); // Using sonner toast
    };

  const handleScan = async () => {
    if (!selectedFile) {
        toast.error('Please select an image file first.');
        return;
    }

    setIsScanning(true);
    resetState();
    const loadingToastId = toast.loading('Sending image to AI for analysis...');

    try {
        const imagePart = await fileToGenerativePart(selectedFile);
        // Keep your prompt specific and clear about ONLY returning JSON
        const prompt = `Analyze the provided image of a medical prescription. Extract the details and return them as a clean JSON object. Do not include the "\`\`\`json" markdown wrapper or any other explanatory text. The JSON object must have this exact structure: {"clinicDetails":{"name":"...","doctor":{"name":"...","qualifications":"..."}},"patientDetails":{"name":"...","age":"...","gender":"..."},"issueDate":"YYYY-MM-DD","medications":[{"name":"...","dosage":"...","purpose":"...","duration":"..."}],"otherTreatments":[{"name":"...","instructions":"...","notes":"..."}],"generalAdvice":["..."],"followUpWarning":"..."}. If a field is missing, use null or an empty array. Ensure the date is in YYYY-MM-DD format.`;
        
        const payload = { contents: [{ role: "user", parts: [imagePart, { text: prompt }] }] };
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`API Error: ${response.status} (${response.statusText}). Body: ${errorBody}`);
        }

        const result = await response.json();
        
        if (result.candidates && result.candidates[0].content.parts[0].text) {
            let rawText = result.candidates[0].content.parts[0].text;
            
            // --- NEW ROBUST JSON EXTRACTION ---
            const jsonMatch = rawText.match(/```json\n([\s\S]*?)\n```/); // Try to find markdown block first
            let jsonString = '';

            if (jsonMatch && jsonMatch[1]) {
                jsonString = jsonMatch[1].trim(); // Extract content from markdown block
            } else {
                // If markdown block not found, try to find the first { to last }
                const start = rawText.indexOf('{');
                const end = rawText.lastIndexOf('}');
                if (start !== -1 && end !== -1 && end > start) {
                    jsonString = rawText.substring(start, end + 1).trim();
                } else {
                    // Fallback if no clear JSON structure is found
                    throw new Error('AI analysis did not return a recognizable JSON structure.');
                }
            }

            // Optional: Further clean common unwanted characters just in case
            jsonString = jsonString.replace(/[\u0000-\u001F\u007F-\u009F]/g, ''); // Remove non-printable ASCII chars
            
            try {
                const parsedData = JSON.parse(jsonString);
                setPrescription(parsedData);
                toast.success('Scan complete! Prescription details extracted.', { id: loadingToastId });
            } catch (jsonParseError) {
                console.error("JSON Parsing Error:", jsonParseError);
                console.error("Attempted to parse:", jsonString);
                // Provide specific error message to user
                throw new Error(`Failed to parse AI response as JSON. Received: "${jsonString.substring(0, 100)}..."`);
            }
        } else {
            console.error("AI analysis returned no content:", result);
            throw new Error('AI analysis failed to return valid content.');
        }
    } catch (error) {
        console.error('AI Scan Error:', error);
        toast.error(error.message || 'Failed to scan prescription. See console.', { id: loadingToastId });
    } finally {
        setIsScanning(false);
    }
};
// --- Function to get a simple explanation from Gemini ---
const handleExplain = async () => {
    if (!prescription) {
        toast.error("No prescription data to explain."); // Using sonner toast
        return;
    }

    setIsExplaining(true);
    const loadingToastId = toast.loading('Asking AI for a simple explanation...'); // Using sonner toast
    
    try {
        const medicationsText = prescription.medications.map(m => `- ${m.name}: ${m.dosage}`).join('\n');
        const prompt = `You are a friendly medical assistant. Explain the following prescription to the patient in simple, easy-to-understand terms. Do not give medical advice, just clarify the prescription. Address the patient directly (e.g., "Your doctor has prescribed..."). Cover what each medication is for, the general advice, and the importance of the warnings. Prescription:\nMedications:\n${medicationsText}\nGeneral Advice: ${prescription.generalAdvice.join(' ')}\nWarning: ${prescription.followUpWarning}`;

        const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // Ensure this is correctly configured

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`API Error: ${response.status} (${response.statusText}). Body: ${errorBody}`);
        }

        const result = await response.json();

        if (result.candidates && result.candidates[0].content.parts[0].text) {
            setExplanation(result.candidates[0].content.parts[0].text);
            toast.success('Explanation generated!', { id: loadingToastId }); // Using sonner toast
        } else {
             console.error("AI explanation returned no content:", result);
             throw new Error('AI explanation failed to return valid content.');
        }
    } catch (error) {
        console.error("AI Explain Error:", error);
        toast.error(error.message || 'Failed to get explanation.', { id: loadingToastId }); // Using sonner toast
    } finally {
        setIsExplaining(false);
    }
};

    // --- New Handler for "View Medicines" button ---
    const handleViewMedicines = () => {
        if (prescription && prescription.medications && prescription.medications.length > 0) {
            navigate('/medicines', { state: { medications: prescription.medications } });
        } else {
            toast.error("No medication data found in the scanned prescription to view.");
        }
    };

    return (
        <div className="bg-gray-50 min-h-[calc(100vh-120px)] font-sans p-4 sm:p-6 md:p-8"> {/* Adjusted min-height to account for Navbar/Footer */}
            {/* Toaster is now in App.jsx */}
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-6 md:p-8">
                <header className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">AI Prescription Scanner</h1>
                    <p className="text-slate-500 mt-2">Upload a prescription and let AI read and explain it for you.</p>
                </header>

                {/* --- MODIFIED UPLOAD SECTION --- */}
                {/* Show the Upload button only if no image is selected yet. */}
                {!selectedFile && (
                    <div className="text-center mb-6">
                        <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
                        <button 
                            onClick={() => fileInputRef.current.click()} 
                            disabled={isScanning}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center mx-auto w-full sm:w-auto transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            <UploadCloud className="w-5 h-5 mr-2" /> Upload Prescription
                        </button>
                    </div>
                )}
                
                {imagePreview && (
                    <div className="mb-6 relative animate-fade-in">
                        <h2 className="text-xl font-semibold mb-3 text-slate-700">Image Preview</h2>
                        <img src={imagePreview} alt="Prescription Preview" className="w-full max-h-[500px] object-contain mx-auto rounded-md shadow-lg bg-slate-50 p-2" />
                        <button onClick={handleRemoveImage} className="absolute top-0 right-0 mt-4 mr-4 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 shadow-lg transition-transform hover:scale-110" aria-label="Remove image">
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* Show the Scan button only if an image HAS been selected */}
                {selectedFile && (
                    <div className="text-center mb-6">
                        <button onClick={handleScan} disabled={isScanning} className="bg-green-600  hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center mx-auto w-full sm:w-auto transition-all duration-300 shadow-lg hover:shadow-xl">
                            <ScanLine className="w-5 h-5 mr-2" />
                            {isScanning ? 'AI is Scanning...' : 'Scan with AI'}
                        </button>
                    </div>
                )}
                
                {isScanning && (
                    <div className="text-center py-4">
                        <div className="text-lg text-slate-600 font-medium">Analyzing...</div>
                    </div>
                )}

                {prescription && !isScanning && (
                    <div className="mt-6 animate-fade-in">
                        <PrescriptionHeader clinic={prescription.clinicDetails} />
                        <div className="p-6 bg-slate-50 rounded-b-xl">
                            <PatientInfo patient={prescription.patientDetails} date={prescription.issueDate} />
                            
                            {prescription.medications?.length > 0 && <div className="mt-6"><h2 className="text-xl font-semibold mb-3 text-slate-700">Medications</h2><div className="grid grid-cols-1 gap-4">{prescription.medications.map((med, index) => <MedicationCard key={index} med={med} />)}</div></div>}
                            
                            {prescription.generalAdvice?.length > 0 && <div className="mt-6 p-4 border rounded-lg bg-blue-50"><h3 className="font-bold text-blue-800 mb-2 flex items-center"><Info className="w-5 h-5 mr-2"/>General Advice</h3><ul className="list-disc list-inside text-blue-700">{prescription.generalAdvice.map((note, index) => <li key={index}>{note}</li>)}</ul></div>}
                            
                            {prescription.followUpWarning && <div className="mt-6 p-4 border rounded-lg bg-red-50"><h3 className="font-bold text-red-800 mb-2 flex items-center"><AlertTriangle className="w-5 h-5 mr-2"/>Important Warning</h3><p className="text-red-700">{prescription.followUpWarning}</p></div>}
                            
                            <div className="text-center mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button onClick={handleExplain} disabled={isExplaining} className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed flex items-center justify-center mx-auto w-full transition-all duration-300 shadow-lg hover:shadow-xl">
                                    <Sparkles className="w-5 h-5 mr-2"/>
                                    {isExplaining ? 'Thinking...' : 'Explain This to Me'}
                                </button>
                                {/* NEW BUTTON FOR VIEWING MEDICINES */}
                                {prescription.medications?.length > 0 && (
                                    <button onClick={handleViewMedicines} className="bg-gradient-to-r from-green-600 to-teal-700 hover:from-green-600 hover:to-teal-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center mx-auto w-full transition-all duration-300 shadow-lg hover:shadow-xl">
                                        <Pill className="w-5 h-5 mr-2"/>
                                        View Medications
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </button>
                                )}
                            </div>
                            
                            <ExplanationDisplay explanation={explanation} isLoading={isExplaining} />
                        </div>
                    </div>
                )}

            </div>
            <style>{`.animate-fade-in { animation: fadeIn 0.5s ease-in-out; } @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } .prose p { margin-bottom: 1em; }`}</style>
        </div>
    );
};

export default UploadPrescription;