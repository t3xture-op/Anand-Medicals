import React from "react";

const AboutUs = () => {
  return (
    <div className="bg-white min-h-screen py-10 px-4 sm:px-8 lg:px-20">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-green-700 mb-6 text-center">
          About Us
        </h1>
        <p className="text-lg text-gray-700 mb-6 text-center">
          Welcome to <strong>Anand Medicals</strong> – Your Trusted Health Partner
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-green-600 mb-2">Who We Are</h2>
          <p className="text-gray-700">
            <strong>Anand Medicals</strong> is your trusted neighborhood pharmacy,
            committed to delivering quality healthcare products and compassionate service.
            Located at the heart of the community, we provide a wide range of prescription
            medicines, over-the-counter products, and health essentials — all under one roof.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-green-600 mb-2">Our Mission</h2>
          <p className="text-gray-700">
            To make healthcare accessible, affordable, and reliable for every customer by offering
            genuine medicines and expert guidance.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-green-600 mb-2">What We Offer</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li><strong>Prescription Medicines:</strong> Doctor-prescribed, authentic medications.</li>
            <li><strong>OTC Products:</strong> Cold & flu, pain relief, allergy and wellness products.</li>
            <li><strong>Health & Wellness:</strong> Supplements, vitamins, and daily care items.</li>
            <li><strong>Customer Support:</strong> Personalized advice and prescription assistance.</li>
            <li><strong>Online Ordering:</strong> Home delivery and store pickup (if applicable).</li>
          </ul>
        </section>

        <div className="bg-blue-50 border-l-4 border-green-500 p-4 rounded-lg mb-10">
          <h2 className="text-xl font-semibold text-green-700 mb-2">Why Choose Anand Medicals?</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>✔️ Licensed & Certified Pharmacy</li>
            <li>✔️ Trusted by Local Doctors & Clinics</li>
            <li>✔️ Knowledgeable & Friendly Staff</li>
            <li>✔️ Competitive Prices & Discounts</li>
            <li>✔️ Fast, Reliable Service</li>
          </ul>
        </div>

        <section>
          <h2 className="text-2xl font-semibold text-green-600 mb-2">Serving You With Care</h2>
          <p className="text-gray-700">
            At Anand Medicals, we believe that healthcare is more than just selling medicines — it’s
            about building trust, offering help, and caring for every individual who walks through
            our doors.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;