import React, { useState } from 'react';
import { FaEnvelope } from 'react-icons/fa';

const initialForm = {
  message: ''
};

const ContactSection = () => {
  const [formData, setFormData] = useState(initialForm);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const subject = encodeURIComponent('Feedback for The Prompt Collection');
    const body = encodeURIComponent(formData.message.trim());
    window.location.href = `mailto:buildwizai@gmail.com?subject=${subject}&body=${body}`;
    setFormData(initialForm);
  };

  return (
    <section className="mt-12 mb-16">
      <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <FaEnvelope className="w-6 h-6 text-green-500" />
          Share Your Feedback
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          Have ideas, requests, or success stories? Drop us a note and we&apos;ll get back to you.
        </p>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label htmlFor="message" className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us how we can make The Prompt Collection even better."
              className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full md:w-auto px-6 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Email Feedback
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;
