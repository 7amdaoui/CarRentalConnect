import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Mail, 
  Trash2,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Mock message type
type Message = {
  id: string;
  from: string;
  subject: string;
  content: string;
  date: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
};

const AdminMessages = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock messages data
  useEffect(() => {
    const mockMessages: Message[] = [
      {
        id: '1',
        from: 'client@example.com',
        subject: 'Question sur ma réservation',
        content: 'Bonjour, j\'ai une question concernant ma réservation #12345...',
        date: '2024-03-15T10:30:00',
        read: false,
        priority: 'high'
      },
      {
        id: '2',
        from: 'support@example.com',
        subject: 'Mise à jour système',
        content: 'Une mise à jour du système est prévue ce weekend...',
        date: '2024-03-14T15:45:00',
        read: true,
        priority: 'medium'
      },
      {
        id: '3',
        from: 'partenaire@example.com',
        subject: 'Nouvelle demande de partenariat',
        content: 'Nous sommes intéressés par un partenariat avec votre service...',
        date: '2024-03-13T09:15:00',
        read: false,
        priority: 'low'
      }
    ];

    setMessages(mockMessages);
    setIsLoading(false);
  }, []);

  const handleDeleteMessage = (id: string) => {
    setMessages(messages.filter(msg => msg.id !== id));
    toast.success("Message supprimé avec succès");
  };

  const handleMarkAsRead = (id: string) => {
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, read: true } : msg
    ));
    toast.success("Message marqué comme lu");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'd MMMM yyyy HH:mm', { locale: fr });
  };

  const filteredMessages = messages.filter(message =>
    message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <Helmet>
        <title>Messages | Admin CarRentalConnect</title>
      </Helmet>
      
      <div className="space-y-6 p-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-display">Messages</h1>
        </div>

        {/* Search */}
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="search"
            placeholder="Rechercher un message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          <Button type="submit">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages Table */}
        <div className="rounded-md border bg-white">
          <Table>
            <TableCaption>Liste des messages</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>De</TableHead>
                <TableHead>Sujet</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Priorité</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="w-8 h-8 border-4 border-morocco-blue border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-gray-500 mt-2">Chargement en cours...</p>
                  </TableCell>
                </TableRow>
              ) : filteredMessages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-gray-500">Aucun message trouvé</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredMessages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell>{message.from}</TableCell>
                    <TableCell>{message.subject}</TableCell>
                    <TableCell>{formatDate(message.date)}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={message.priority === 'high' ? 'destructive' : 
                                message.priority === 'medium' ? 'default' : 'secondary'}
                      >
                        {message.priority === 'high' ? 'Haute' :
                         message.priority === 'medium' ? 'Moyenne' : 'Basse'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={message.read ? 'secondary' : 'default'}>
                        {message.read ? 'Lu' : 'Non lu'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMarkAsRead(message.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteMessage(message.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminMessages;