import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking"

import { Button } from "@/components/Button";
import { useOAuth } from "@clerk/clerk-expo";

WebBrowser.maybeCompleteAuthSession();

export default function SignIn() {
  const [isLoading, setIsLoaging] = useState(false);
  const googleOnAuth = useOAuth({ strategy: "oauth_google" });

  async function onGoogleSignIn() {
    try {
      setIsLoaging(true);

      const redirectUrl = Linking.createURL("/")

      const oAuthFlow = await googleOnAuth.startOAuthFlow({redirectUrl});

      if (oAuthFlow.authSessionResult?.type === "success") {
        if (oAuthFlow.setActive) {
          await oAuthFlow.setActive({ session: oAuthFlow.createdSessionId });
        }
      } else {
        setIsLoaging(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoaging(false);
    }
  }

  useEffect(() => {
    WebBrowser.warmUpAsync();

    return () => {
      WebBrowser.warmUpAsync();
    };
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entar</Text>
      <Button
        title="Entrar com o Google"
        icon="logo-google"
        onPress={onGoogleSignIn}
        isLoading={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    justifyContent: "center",
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
});
