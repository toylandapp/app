import AuthHeader from "@/components/auth/header";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import theme from "@/constants/theme";
import useBoundStore from "@/states";
import { loginWithPasswordSchema } from "@/states/auth-slice";
import { translateAuthErrorMessage } from "@/utils/errors";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Page() {
  const insets = useSafeAreaInsets();
  const loading = useBoundStore((state) => state.loginWithPasswordLoading);
  const loginWithPassword = useBoundStore((state) => state.loginWithPassword);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setFocus,
    getValues,
  } = useForm({
    resolver: zodResolver(loginWithPasswordSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        justifyContent: "space-between",
      }}
    >
      <View>
        <AuthHeader title="Entrar" />
        <View
          style={{
            gap: theme.spacing.lg,
            paddingTop: theme.spacing.lg,
            paddingHorizontal: theme.spacing.lg,
          }}
        >
          <Input
            controller={{
              control,
              name: "email",
              rules: { required: true },
            }}
            label="E-mail"
            placeholder="nome@exemplo.com"
            errorMessage={translateAuthErrorMessage(
              errors.email?.message ?? ""
            )}
            keyboardType="email-address"
            onSubmitEditing={() => setFocus("password")}
            returnKeyType="next"
            autoCapitalize="none"
          />
          <Input
            controller={{
              control,
              name: "password",
              rules: { required: true },
            }}
            label="Senha"
            placeholder="Digite sua senha"
            errorMessage={translateAuthErrorMessage(errors?.password?.message)}
            secureTextEntry
          />
          <Button onPress={handleSubmit(loginWithPassword)} loading={loading}>
            Entrar
          </Button>
          <Button
            onPress={() =>
              router.push({
                pathname: "reset-password",
                params: {
                  email: getValues("email"),
                },
              })
            }
            variant="ghost"
          >
            Esqueceu sua senha?
          </Button>
        </View>
      </View>
      <Button onPress={() => router.push("register")} variant="ghost">
        Você não tem uma conta?
      </Button>
    </View>
  );
}
