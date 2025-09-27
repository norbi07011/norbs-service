import React, { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClientById, createClient, updateClient } from '../../services/clients';
import { ClientData } from '../../types';
import { useToast } from '../../hooks/useToast';

const ClientForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditing = Boolean(id);
    const { addToast } = useToast();

    const [formData, setFormData] = useState<ClientData>({
        name: '',
        email: '',
        phone: '',
        language: 'nl',
        notes: '',
        address: '',
        city: '',
        zipCode: '',
        country: '',
        vatNumber: '',
    });

    useEffect(() => {
        if (isEditing) {
            const fetchClient = async () => {
                const client = await getClientById(id!);
                if (client) setFormData(client);
            };
            fetchClient();
        }
    }, [id, isEditing]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await updateClient(id!, formData);
                addToast('Client updated successfully', 'success');
            } else {
                await createClient(formData);
                addToast('Client created successfully', 'success');
            }
            navigate('/admin/clients');
        } catch (error) {
            addToast(`Failed to ${isEditing ? 'update' : 'create'} client`, 'error');
        }
    };

    const inputClass = "w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:ring-accent focus:border-accent outline-none";
    const labelClass = "block text-sm font-medium text-muted-foreground mb-2";

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">{isEditing ? 'Edit Client' : 'Add New Client'}</h1>
            <div className="uiverse-card p-8">
                 <div className="uiverse-card-circles"><div></div><div></div><div></div></div>
                 <div className="uiverse-card-content relative z-10">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <fieldset>
                            <legend className="text-lg font-semibold text-foreground mb-4">Contact Information</legend>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className={labelClass}>Full Name</label>
                                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className={inputClass} />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className={labelClass}>Email</label>
                                        <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className={inputClass} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="phone" className={labelClass}>Phone</label>
                                        <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className={inputClass} />
                                    </div>
                                    <div>
                                        <label htmlFor="language" className={labelClass}>Preferred Language</label>
                                        <select name="language" id="language" value={formData.language} onChange={handleChange} className={`${inputClass} appearance-none`}>
                                            <option value="nl">Dutch</option>
                                            <option value="en">English</option>
                                            <option value="tr">Turkish</option>
                                            <option value="pl">Polish</option>
                                            <option value="de">German</option>
                                            <option value="fr">French</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </fieldset>

                        <fieldset>
                             <legend className="text-lg font-semibold text-foreground mb-4 pt-6 border-t border-border-color">Billing Details</legend>
                             <div className="space-y-6">
                                <div>
                                    <label htmlFor="address" className={labelClass}>Address</label>
                                    <input type="text" name="address" id="address" value={formData.address} onChange={handleChange} className={inputClass} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label htmlFor="city" className={labelClass}>City</label>
                                        <input type="text" name="city" id="city" value={formData.city} onChange={handleChange} className={inputClass} />
                                    </div>
                                     <div>
                                        <label htmlFor="zipCode" className={labelClass}>Zip Code</label>
                                        <input type="text" name="zipCode" id="zipCode" value={formData.zipCode} onChange={handleChange} className={inputClass} />
                                    </div>
                                    <div>
                                        <label htmlFor="country" className={labelClass}>Country</label>
                                        <input type="text" name="country" id="country" value={formData.country} onChange={handleChange} className={inputClass} />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="vatNumber" className={labelClass}>VAT Number</label>
                                    <input type="text" name="vatNumber" id="vatNumber" value={formData.vatNumber} onChange={handleChange} className={inputClass} />
                                </div>
                             </div>
                        </fieldset>
                        
                        <div>
                            <label htmlFor="notes" className="block text-sm font-medium text-muted-foreground mb-2">Notes</label>
                            <textarea name="notes" id="notes" value={formData.notes} onChange={handleChange} rows={4} className={inputClass}></textarea>
                        </div>
                        <div className="flex justify-end gap-4 pt-4">
                            <button type="button" onClick={() => navigate('/admin/clients')} className="px-6 py-2 font-semibold text-foreground bg-muted rounded-full hover:bg-secondary">Cancel</button>
                            <button type="submit" className="px-6 py-2 font-semibold text-accent-foreground bg-accent rounded-full hover:bg-opacity-80">{isEditing ? 'Save Changes' : 'Create Client'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ClientForm;