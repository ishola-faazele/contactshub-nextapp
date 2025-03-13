'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { XCircle } from 'lucide-react';

const ContactForm = ({ addContact, updateContact, currentContact, setCurrentContact, onCancel }) => {
  const [contact, setContact] = useState({ name: '', email: '', phone: '', categories: [] });
  const [categoryInput, setCategoryInput] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (currentContact) {
      setContact({ ...currentContact, categories: currentContact.categories || [] });
    } else {
      setContact({ name: '', email: '', phone: '', categories: [] });
    }
  }, [currentContact]);

  const validateForm = () => {
    const newErrors = {};
    if (!contact.name.trim()) newErrors.name = 'Name is required';
    if (!contact.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(contact.email)) {
      newErrors.email = 'Invalid email';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContact({ ...contact, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const handleCategoryChange = (e) => setCategoryInput(e.target.value);

  const addCategory = () => {
    if (categoryInput.trim() && !contact.categories.includes(categoryInput.trim())) {
      setContact({ ...contact, categories: [...contact.categories, categoryInput.trim()] });
      setCategoryInput('');
    }
  };

  const removeCategory = (categoryToRemove) => {
    setContact({
      ...contact,
      categories: contact.categories.filter(category => category !== categoryToRemove),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    currentContact ? updateContact(currentContact.id, contact) : addContact(contact);
    setContact({ name: '', email: '', phone: '', categories: [] });
  };

  return (
    <motion.div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        {currentContact ? 'Edit Contact' : 'Add Contact'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Name</Label>
          <Input type="text" name="name" value={contact.name} onChange={handleChange} placeholder="Enter name" />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
        <div>
          <Label>Email</Label>
          <Input type="email" name="email" value={contact.email} onChange={handleChange} placeholder="Enter email" />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>
        <div>
          <Label>Phone</Label>
          <Input type="text" name="phone" value={contact.phone} onChange={handleChange} placeholder="Enter phone number" />
        </div>
        <div>
          <Label>Categories</Label>
          <div className="flex gap-2">
            <Input type="text" value={categoryInput} onChange={handleCategoryChange} placeholder="Add category" />
            <Button type="button" onClick={addCategory} disabled={!categoryInput.trim()}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {contact.categories.map((category, index) => (
              <span key={index} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center gap-2">
                {category}
                <XCircle size={16} className="text-red-500 cursor-pointer" onClick={() => removeCategory(category)} />
              </span>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">{currentContact ? 'Update Contact' : 'Save Contact'}</Button>
        </div>
      </form>
    </motion.div>
  );
};

export default ContactForm;
