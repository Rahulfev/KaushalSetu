import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import axiosInstance from '@/services/axiosInstance';

const OrganizationProfile = () => {
  const [profile, setProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/organization/profile');
      setProfile(response.data);
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await axiosInstance.put('/organization/profile', profile);
      setSuccess('Profile updated successfully');
      setIsEditing(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setError(null);
    setSuccess(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    setSuccess(null);
    fetchProfile(); // Reset to original data
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <Card>
        <Card.Header>
          <h4>Organization Profile</h4>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          
          <Form onSubmit={handleSave}>
            <Form.Group className="mb-3">
              <Form.Label>Organization Name</Form.Label>
              <Form.Control
                name="orgName"
                value={profile.orgName || ''}
                onChange={handleChange}
                disabled={!isEditing}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>GST Number</Form.Label>
              <Form.Control
                name="gstNumber"
                value={profile.gstNumber || ''}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="address"
                value={profile.address || ''}
                onChange={handleChange}
                disabled={!isEditing}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>District</Form.Label>
              <Form.Control
                name="district"
                value={profile.district || ''}
                onChange={handleChange}
                disabled={!isEditing}
                required
              />
            </Form.Group>

            {isEditing && (
              <div className="d-flex gap-2 mb-3">
                <Button type="submit" variant="success" disabled={loading}>
                  {loading ? 'Saving...' : 'Save'}
                </Button>
                <Button 
                  type="button"
                  variant="secondary" 
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            )}
          </Form>
          
          {!isEditing && (
            <Button type="button" variant="primary" onClick={handleEdit}>
              Edit Profile
            </Button>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default OrganizationProfile;