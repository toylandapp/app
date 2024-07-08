import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { colors } from "@/constants/theme";
import { Redirect, Tabs } from "expo-router";
import React, { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { useAuthStore } from "../../states/auth";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const token = useAuthStore(useShallow((state) => state.token));
  const fetchUser = useAuthStore((state) => state.fetchUser);
  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  if (!token) return <Redirect href="/(auth)/get-started" />;

  return (
    <Tabs
      sceneContainerStyle={{
        backgroundColor: colors.background,
        paddingTop: insets.top,
      }}
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Grupos",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "chatbubbles" : "chatbubbles-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explorar",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "compass" : "compass-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notificações",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "notifications" : "notifications-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "person-circle" : "person-circle-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
