"use client";
import { useEffect, useState } from 'react';
import { UserAuth } from "./context/AuthContext";
import { 
  Button, 
  Container, 
  Typography, 
  Box,
  Paper,
  Stack
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const { user, googleSignIn } = UserAuth();
  const [loading, setLoading] = useState(true);

  const handleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setLoading(false);
    };
    checkAuth();
  }, []);

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Stack spacing={3} alignItems="center">
          <Typography variant="h4" component="h1" gutterBottom>
            WorkLog Management System
          </Typography>
          
          {user ? (
            <Box textAlign="center">
              <Typography variant="h6" gutterBottom>
                Welcome, {user.displayName}!
              </Typography>
              <Button 
                variant="contained" 
                component={Link} 
                href="/profile"
                sx={{ mt: 2 }}
              >
                Go to Your WorkLogs
              </Button>
            </Box>
          ) : (
            <Box textAlign="center">
              <Typography variant="body1" gutterBottom>
                Sign in to manage your work logs
              </Typography>
              <Button 
                variant="contained" 
                onClick={handleSignIn}
                sx={{ mt: 2 }}
              >
                Sign in with Google
              </Button>
            </Box>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}