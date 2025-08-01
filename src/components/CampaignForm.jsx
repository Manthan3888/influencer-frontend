import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import './CampaignForm.css';
import icon from '../assets/icon.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CampaignForm = () => {
    const [formData, setFormData] = useState({
        campaignName: '',
        campaignType: '',
        brandName: '',
        niche: '',
        budget: '',
        deliverables: '',
        platform: {
            instagram: false,
            facebook: false,
            youtube: false,
        },
        influencer: '',
        followers: '',
        startDate: '',
        endDate: '',
        priority: '',
        notes: '',
        attachment: null,
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, checked, type, files } = e.target;

        if (type === 'file') {
            setFormData((prev) => ({ ...prev, [name]: files[0] }));
            setErrors((prev) => ({ ...prev, [name]: '' }));
        } else if (name in formData.platform) {
            setFormData((prev) => ({
                ...prev,
                platform: { ...prev.platform, [name]: checked },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value,
            }));
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const isEmpty = (value) => !value.trim();
    const isAlpha = (value) => /^[a-zA-Z\s]+$/.test(value);

    const toTitleCase = (str) =>
        str.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase());

    const validateTextField = (value, fieldName, errors) => {
        if (isEmpty(value)) {
            errors[fieldName] = `${toTitleCase(fieldName)} is required.`;
        } else if (!isAlpha(value)) {
            errors[fieldName] = `${toTitleCase(fieldName)} must contain only letters.`;
        }
    };

    const validateOptionalTextField = (value, fieldName, errors) => {
        if (value && !isAlpha(value)) {
            errors[fieldName] = `${toTitleCase(fieldName)} must contain only letters.`;
        }
    };


    const validateFileField = (file, fieldName, errors) => {
        if (file) {
            const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'text/csv',];
            const maxSize = 2 * 1024 * 1024; // 2MB
            if (!allowedTypes.includes(file.type)) {
                errors[fieldName] = 'Only JPG, PNG, or PDF files are allowed.';
            } else if (file.size > maxSize) {
                errors[fieldName] = 'File size must be less than 2MB.';
            }
        }
    };

    const validateForm = () => {
        let formErrors = {};

        validateTextField(formData.campaignName, 'campaignName', formErrors);
        validateTextField(formData.campaignType, 'campaignType', formErrors);
        validateTextField(formData.brandName, 'brandName', formErrors);
        validateOptionalTextField(formData.niche, 'niche', formErrors);

        if (isEmpty(formData.budget)) {
            formErrors.budget = `${toTitleCase('budget')} is required.`;
        }

        // Only check if followers is empty (no numeric validation)
        if (isEmpty(formData.followers)) {
            formErrors.followers = `${toTitleCase('followers')} is required.`;
        }

        if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
            formErrors.endDate = 'End date must be after start date.';
        }

        validateFileField(formData.attachment, 'attachment', formErrors);

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error("Please Fix the Validation Errors.");
            return;
        }

        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'platform') {
                    data.append('platform', JSON.stringify(value));
                } else if (key === 'attachment' && value) {
                    data.append('attachment', value);
                } else {
                    data.append(key, value);
                }
            });

            const response = await axios.post(
                'https://n8n.srv903939.hstgr.cloud/webhook/d9e67f53-dbf7-4886-946d-ba1c51553e99',
                data,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.status === 200 || response.status === 201) {
                toast.success('Campaign Added Successfully!');
                setFormData({
                    campaignName: '',
                    campaignType: '',
                    brandName: '',
                    niche: '',
                    budget: '',
                    deliverables: '',
                    platform: {
                        instagram: false,
                        facebook: false,
                        youtube: false,
                    },
                    influencer: '',
                    followers: '',
                    startDate: '',
                    endDate: '',
                    priority: '',
                    notes: '',
                    attachment: null,
                });
                setErrors({});
            }
        } catch (error) {
            toast.error('There was an error submitting the Campaign Form.');
            console.error(error);
        }
    };

    const renderError = (field) =>
        errors[field] ? <div className="text-danger small mt-1">{errors[field]}</div> : null;

    return (
        <div className="bg-image py-5">
            <Container>
                <Row className="main justify-content-between">
                    <Col xl={2} className='left_side d-none d-xl-block position-relative p-0'>
                        <img src={icon} alt='item' className='left_image' />
                        <div className='caption position-absolute top-0 p-5 bg-dark bg-opacity-50 text-white text-justify rounded'>
                            <h1 className='text-center'>Campaign Caption</h1>
                            <p>A marketing campaign is a coordinated series of actions, messages, or promotions with a clear goal—such as increasing brand awareness, launching a product, or driving sales. It’s like a story a brand tells across different platforms.</p>
                            <ul>
                                <li>Clear Objective</li>
                                <li>Target Audience</li>
                                <li>Compelling Message</li>
                                <li>Multiple Channels</li>
                                <li>Creative Content</li>
                                <li>Timeline and Planning</li>
                                <li>Budget Management</li>
                                <li>Monitoring and Analytics</li>
                                <li>Adaptability</li>
                                <li>Call to Action (CTA)</li>
                            </ul>
                        </div>
                    </Col>
                    <Col xl={8}>
                        <div className="card_form p-4 rounded shadow-lg card-style">
                            <h3 className="mb-4 text-center heading">Campaign Details</h3>
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        {/* Left-side Fields */}
                                        <Form.Group className="mb-3">
                                            <Form.Label>Campaign Name</Form.Label>
                                            <Form.Control type="text" name="campaignName" value={formData.campaignName} onChange={handleChange} isInvalid={!!errors.campaignName} />
                                            {renderError('campaignName')}
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Campaign Type</Form.Label>
                                            <Form.Control type="text" name="campaignType" value={formData.campaignType} onChange={handleChange} isInvalid={!!errors.campaignType} />
                                            {renderError('campaignType')}
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Brand Name</Form.Label>
                                            <Form.Control type="text" name="brandName" value={formData.brandName} onChange={handleChange} isInvalid={!!errors.brandName} />
                                            {renderError('brandName')}
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Niche</Form.Label>
                                            <Form.Control type="text" name="niche" value={formData.niche} onChange={handleChange} isInvalid={!!errors.niche} />
                                            {renderError('niche')}
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Budget</Form.Label>
                                            <Form.Control type="text" name="budget" value={formData.budget} onChange={handleChange} isInvalid={!!errors.budget} />
                                            {renderError('budget')}
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Deliverables</Form.Label>
                                            <Form.Control type="text" name="deliverables" value={formData.deliverables} onChange={handleChange} />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Platforms</Form.Label>
                                            <div className="d-flex gap-3">
                                                {['instagram', 'facebook', 'youtube'].map((platform) => (
                                                    <Form.Check key={platform} label={platform.charAt(0).toUpperCase() + platform.slice(1)} name={platform} type="checkbox" checked={formData.platform[platform]} onChange={handleChange} />
                                                ))}
                                            </div>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Influencer's Followers</Form.Label>
                                            <Form.Control type="text" name="followers" value={formData.followers} onChange={handleChange} isInvalid={!!errors.followers} />
                                            {renderError('followers')}
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Start Date</Form.Label>
                                            <Form.Control type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>End Date</Form.Label>
                                            <Form.Control type="date" name="endDate" value={formData.endDate} onChange={handleChange} isInvalid={!!errors.endDate} />
                                            {renderError('endDate')}
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Priority</Form.Label>
                                            <Form.Select name="priority" value={formData.priority} onChange={handleChange}>
                                                <option value="">Select</option>
                                                <option value="high">High</option>
                                                <option value="medium">Medium</option>
                                                <option value="low">Low</option>
                                            </Form.Select>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Notes</Form.Label>
                                            <Form.Control as="textarea" name="notes" rows={3} value={formData.notes} onChange={handleChange} />
                                        </Form.Group>
                                        {/* ✅ New File Field */}
                                        <Form.Group className="mb-3">
                                            <Form.Label>Upload Attachment</Form.Label>
                                            <Form.Control type="file" name="attachment" accept=".jpg,.jpeg,.png,.pdf,.csv" onChange={handleChange} isInvalid={!!errors.attachment} />
                                            {renderError('attachment')}
                                        </Form.Group>
                                        <Button type="submit" className="btn-custom w-100">Submit Campaign</Button>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default CampaignForm;
