import { productStatus } from "@/constants/product-status";
import theme from "@/constants/theme";
import { type Product } from "@/store/product";
import { router } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

function ProductItem(product: Product) {
  return (
    <Pressable
      onPress={() =>
        router.push({ pathname: "/product/[id]", params: { id: product.id } })
      }
      style={{
        flex: 1,
        padding: theme.spacing.sm,
        borderRadius: theme.spacing.lg,
        borderWidth: 2,
        borderColor: theme.colors.border,
      }}
    >
      <View style={{ position: "relative" }}>
        <View
          style={{
            position: "absolute",
            top: theme.spacing.sm,
            left: theme.spacing.sm,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            paddingVertical: theme.spacing.xs,
            paddingHorizontal: theme.spacing.sm,
            borderRadius: theme.spacing.sm,
            zIndex: 1,
          }}
        >
          <Text
            style={{
              fontFamily: "QuicksandMedium",
              fontSize: 14,
              color: theme.colors.white,
            }}
          >
            {productStatus[product.status]}
          </Text>
        </View>
        {product.images.length > 0 ? (
          <Image
            source={{
              uri: `https://assets.toylandapp.com/${product.images[0]}`,
            }}
            style={{
              flex: 1,
              aspectRatio: 1,
              borderRadius: theme.spacing.md,
              backgroundColor: theme.colors.foreground,
            }}
          />
        ) : (
          <View
            style={{
              flex: 1,
              aspectRatio: 1,
              borderRadius: theme.spacing.md,
              backgroundColor: theme.colors.foreground,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
              }}
            >
              {product.name.charAt(0)}
            </Text>
          </View>
        )}
      </View>
      <View style={{ padding: theme.spacing.md, gap: theme.spacing.sm }}>
        <Text
          style={{
            fontFamily: "QuicksandBold",
            fontSize: 16,
          }}
        >
          {product.name}
        </Text>
        {product.description ? (
          <Text
            style={{
              fontFamily: "QuicksandMedium",
              fontSize: 14,
              color: theme.colors.text,
            }}
            numberOfLines={2}
          >
            {product.description}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

export default ProductItem;
