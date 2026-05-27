import React, { useRef, useState } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  Text,
  useToast
} from '@chakra-ui/react';
import { User } from '../types/user.types';

interface ConfirmDeleteProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onConfirm: (id: number) => Promise<void>;
}

export const ConfirmDelete: React.FC<ConfirmDeleteProps> = ({ isOpen, onClose, user, onConfirm }) => {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const toast = useToast();

  const handleDelete = async () => {
    if (!user) return;
    setIsDeleting(true);
    try {
      await onConfirm(user.id);
      onClose();
    } catch (error: any) {
      const apiMessage = error.response?.data?.message || 'Failed to delete employee';
      toast({
        title: 'Error Deleting Employee',
        description: apiMessage,
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top-right'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} motionPreset="slideInBottom">
      <AlertDialogOverlay backdropFilter="blur(4px)">
        <AlertDialogContent borderRadius="2xl">
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete Employee Record
          </AlertDialogHeader>

          <AlertDialogBody>
            <Text mb={2}>
              Are you sure you want to delete the record for <strong>{user?.username}</strong>?
            </Text>
            <Text color="red.500" fontSize="sm">
              This action cannot be undone. This user will be permanently removed from the system database.
            </Text>
          </AlertDialogBody>

          <AlertDialogFooter gap={2}>
            <Button ref={cancelRef} onClick={onClose} variant="ghost" borderRadius="xl">
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleDelete} isLoading={isDeleting} borderRadius="xl" boxShadow="sm">
              Delete Employee
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
