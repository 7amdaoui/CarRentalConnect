import AdminLayout from '@/components/AdminLayout';
import { Helmet } from 'react-helmet-async';

const AdminSettings = () => (
  <AdminLayout>
    <Helmet>
      <title>Paramètres | Admin CarRentalConnect</title>
    </Helmet>
    <div className="p-8">
      <h1 className="text-3xl font-display mb-4">Paramètres</h1>
      <div className="bg-white p-6 rounded shadow text-center text-gray-500">
        La page des paramètres administrateur sera bientôt disponible.
      </div>
    </div>
  </AdminLayout>
);

export default AdminSettings; 