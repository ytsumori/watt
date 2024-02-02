"use client";

import { Center, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  User,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import { authProvider } from "@/lib/firebase";

export function FirebaseLoginProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User>();
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        signInWithPopup(auth, authProvider)
          .then((result) => {
            setUser(result.user);
          })
          .catch((error) => console.error(error));
      }
    });
  }, []);

  if (!user) {
    return (
      <Center w="100vw" h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return <>{children}</>;
}
