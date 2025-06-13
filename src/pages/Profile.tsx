import React, { useState, useEffect, useRef } from 'react';
import userService, { User } from '@/services/userService';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const data = await userService.getCurrentUser();
        setUser(data);
        setForm({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          phone: data.phone || '',
        });
      } catch (error) {
        toast.error("Erreur lors du chargement du profil");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const updated = await userService.updateUser(user.id, form);
      setUser(updated);
      setEditing(false);
      toast.success("Profil mis à jour");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du profil");
    } finally {
      setSaving(false);
    }
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center bg-gray-50">
          <div className="w-16 h-16 border-4 border-morocco-blue border-t-transparent rounded-full animate-spin"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-8 md:py-12">
        <div className="container mx-auto px-4 flex justify-center">
          <div className="max-w-xl w-full p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4 text-morocco-blue">Mon Profil</h2>
            <div className="flex items-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden mr-4 flex items-center justify-center">
                {profilePic ? (
                  <img src={profilePic} alt="Profil" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 text-4xl">👤</span>
                )}
              </div>
              <button
                className="bg-morocco-blue text-white px-3 py-1 rounded hover:bg-morocco-blue/90"
                onClick={() => fileInputRef.current?.click()}
              >
                Changer la photo
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleProfilePicChange}
                aria-label="Changer la photo de profil"
                title="Changer la photo de profil"
              />
            </div>
            {editing ? (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="w-1/2">
                    <label className="block font-medium" htmlFor="profile-firstName">Prénom</label>
                    <input
                      id="profile-firstName"
                      className="border rounded px-3 py-2 w-full"
                      value={form.firstName}
                      onChange={e => setForm({ ...form, firstName: e.target.value })}
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block font-medium" htmlFor="profile-lastName">Nom</label>
                    <input
                      id="profile-lastName"
                      className="border rounded px-3 py-2 w-full"
                      value={form.lastName}
                      onChange={e => setForm({ ...form, lastName: e.target.value })}
                      placeholder="Votre nom"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-medium" htmlFor="profile-phone">Téléphone</label>
                  <input
                    id="profile-phone"
                    className="border rounded px-3 py-2 w-full"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="Votre téléphone"
                  />
                </div>
                <div className="flex space-x-2">
                  <button className="bg-morocco-blue text-white px-4 py-2 rounded hover:bg-morocco-blue/90" onClick={handleSave} disabled={saving}>Enregistrer</button>
                  <button className="bg-gray-200 px-4 py-2 rounded" onClick={() => setEditing(false)} disabled={saving}>Annuler</button>
                </div>
              </div>
            ) : (
              <div className="space-y-2 mb-4">
                <div><strong>Prénom:</strong> {user?.firstName}</div>
                <div><strong>Nom:</strong> {user?.lastName}</div>
                <div><strong>Email:</strong> {user?.email}</div>
                <div><strong>Téléphone:</strong> {user?.phone || <span className="text-gray-400">Non renseigné</span>}</div>
                <button className="mt-2 bg-morocco-blue text-white px-4 py-2 rounded hover:bg-morocco-blue/90" onClick={() => setEditing(true)}>Modifier</button>
              </div>
            )}
            {/* Password change section can be added here if backend supports it */}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile; 