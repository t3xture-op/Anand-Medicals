import React, { useState, useRef, useEffect } from 'react';
import { Upload, Plus, X, Loader2 } from 'lucide-react';
import { createWorker } from 'tesseract.js';

export default function UploadPrescription() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [doctorName, setDoctorName] = useState('');
  const [doctorSpecialization, setDoctorSpecialization] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [error, setError] = useState(null);

  // Use ref to handle progress updates in worker callback
  const progressRef = useRef(setProcessingProgress);
  useEffect(() => {
    progressRef.current = setProcessingProgress;
  }, []);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setError(null);
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    await processImage(selectedFile);
  };

  const processImage = async (file) => {
    setIsProcessing(true);
    setProcessingProgress(0);

    try {
      const worker = await createWorker({
        logger: (m) => {
          if (m.status === 'recognizing text') {
            progressRef.current(m.progress * 100);
          }
        },
      });

      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      
      const { data: { text } } = await worker.recognize(file);
      const extractedInfo = extractInformation(text);
      
      setDoctorName(extractedInfo.doctorName);
      setDoctorSpecialization(extractedInfo.specialization);
      setMedicines(extractedInfo.medicines);
      
      await worker.terminate();
    } catch (err) {
      console.error('OCR processing error:', err);
      setError('Failed to process prescription. Please try again or enter manually.');
    } finally {
      setIsProcessing(false);
    }
  };

  const extractInformation = (text) => {
    const lines = text.split('\n');
    let doctorName = '';
    let specialization = '';
    const medicines = [];
    
    // Improved regex patterns
    const doctorPattern = /(?:dr|doctor|md)[.]?\s*([a-z]+\s+[a-z]+(?:\s+[a-z]+)?)/gi;
    const medicinePattern = /([A-Za-z\s-]+)\s+(\d+(?:\.\d+)?\s*(?:mg|ml|g|IU|%|mcg)?)\s*(?:,|-)?\s*((?:take\s*)?(?:once|twice|thrice|daily|weekly|monthly|every\s*\d+\s*hours?|morning|night|evening|bedtime|as\s+needed)[\w\s]*)/i;

    lines.forEach(line => {
      const lowerLine = line.toLowerCase();
      
      // Extract doctor name
      const doctorMatch = line.match(doctorPattern);
      if (doctorMatch) {
        doctorName = doctorMatch[0].trim();
      }

      // Extract specialization
      const specializations = ['cardiologist', 'pediatrician', 'neurologist', 'dermatologist'];
      specializations.forEach(spec => {
        if (lowerLine.includes(spec)) {
          specialization = spec.charAt(0).toUpperCase() + spec.slice(1);
        }
      });

      // Extract medicines
      const medicineMatch = line.match(medicinePattern);
      if (medicineMatch) {
        medicines.push({
          name: medicineMatch[1].trim(),
          dosage: medicineMatch[2].trim(),
          frequency: medicineMatch[3].trim()
        });
      }
    });

    return { doctorName, specialization, medicines };
  };

  const addMedicine = () => {
    setMedicines([...medicines, { name: '', dosage: '', frequency: '' }]);
  };

  const removeMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const updateMedicine = (index, field, value) => {
    const updatedMedicines = [...medicines];
    updatedMedicines[index] = { ...updatedMedicines[index], [field]: value };
    setMedicines(updatedMedicines);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!doctorName || medicines.length === 0) {
      setError('Please fill required fields (Doctor Name and at least one medicine)');
      return;
    }
    console.log({
      file,
      doctorName,
      doctorSpecialization,
      medicines,
      notes
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Upload Prescription</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* File upload section */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Upload your prescription
              </label>
              <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-green-500 transition-colors">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isProcessing}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG up to 10MB
                  </p>
                </div>
              </div>
            </div>

            {/* Processing indicator */}
            {isProcessing && (
              <div className="text-center py-4">
                <Loader2 className="animate-spin h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Processing prescription...</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div 
                    role="progressbar"
                    aria-valuenow={processingProgress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${processingProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Preview section */}
            {preview && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preview
                </label>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={preview}
                    alt="Prescription preview"
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            )}

            {/* Doctor information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="doctorName" className="block text-sm font-medium text-gray-700">
                  Doctor's Name
                </label>
                <input
                  type="text"
                  id="doctorName"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  placeholder="Dr. John Doe"
                />
              </div>

              <div>
                <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
                  Specialization
                </label>
                <input
                  type="text"
                  id="specialization"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                  value={doctorSpecialization}
                  onChange={(e) => setDoctorSpecialization(e.target.value)}
                  placeholder="e.g., Cardiologist"
                />
              </div>
            </div>

            {/* Medicines section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Prescribed Medicines
                </label>
                <button
                  type="button"
                  onClick={addMedicine}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Medicine
                </button>
              </div>

              {medicines.map((medicine, index) => (
                <div key={index} className="relative bg-gray-50 p-4 rounded-md">
                  <button
                    type="button"
                    onClick={() => removeMedicine(index)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Medicine Name
                      </label>
                      <input
                        type="text"
                        value={medicine.name}
                        onChange={(e) => updateMedicine(index, 'name', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                        placeholder="Medicine name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Dosage
                      </label>
                      <input
                        type="text"
                        value={medicine.dosage}
                        onChange={(e) => updateMedicine(index, 'dosage', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                        placeholder="e.g., 500mg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Frequency
                      </label>
                      <input
                        type="text"
                        value={medicine.frequency}
                        onChange={(e) => updateMedicine(index, 'frequency', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                        placeholder="e.g., Twice daily"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                id="notes"
                rows={4}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                placeholder="Add any specific instructions or notes for your prescription..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* Form actions */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={() => {
                  setFile(null);
                  setPreview(null);
                  setDoctorName('');
                  setDoctorSpecialization('');
                  setMedicines([]);
                  setNotes('');
                  setError(null);
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="inline-flex justify-center px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
