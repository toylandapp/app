import Header from "@/components/navigation/header";
import DeleteProduct from "@/components/product/delete-product";
import PublishOnMarketplace from "@/components/product/publish-on-marketplace";
import Button from "@/components/ui/button";
import { productStatus } from "@/constants/product-status";
import theme from "@/constants/theme";
import useBoundStore from "@/store";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  SectionList,
  Text,
  View,
} from "react-native";

const screenWidth = Dimensions.get("screen").width;
const size = screenWidth * 0.7;

export default function Screen() {
  const { id } = useLocalSearchParams();
  const fetchProduct = useBoundStore((state) => state.fetchProduct);
  const loading = useBoundStore((state) => state.productLoading);
  const refreshing = useBoundStore((state) => state.productRefreshing);
  const product = useBoundStore((state) =>
    state.products.find((p) => p.id === id)
  );

  useEffect(() => {
    if (id) {
      fetchProduct({ productId: String(id) });
    }
  }, [id]);

  const listing = product?.listing
    ? {
        title: "Dados do Anúncio",
        data: [
          ...(product.listing.type === "sale"
            ? [
                {
                  title: "Preço",
                  value: (product.listing.price / 100).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }),
                },
              ]
            : []),
          {
            title: "Anunciado em",
            value: new Intl.DateTimeFormat("pt-BR").format(
              new Date(product.listing.createdAt)
            ),
          },
        ],
      }
    : [];

  return (
    <View style={{ flex: 1 }}>
      <Header title="Produto" canBack />
      {loading && !product && (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size={24} color={theme.colors.primary} />
        </View>
      )}
      {product && (
        <SectionList
          onRefresh={() => fetchProduct({ productId: String(id) }, true)}
          refreshing={refreshing}
          sections={[
            {
              title: "Dados do Produto",
              data: [
                {
                  title: "Status",
                  value: productStatus[product.status],
                },
                {
                  title: "Adicionado em",
                  value: new Intl.DateTimeFormat("pt-BR").format(
                    new Date(product.createdAt)
                  ),
                },
              ],
            },
          ].concat(listing)}
          keyExtractor={(item) => item.title}
          stickySectionHeadersEnabled={false}
          ListHeaderComponent={() => (
            <>
              <FlatList
                data={product?.images}
                keyExtractor={(item) => item}
                showsHorizontalScrollIndicator={false}
                horizontal
                style={{
                  height: size + theme.spacing.lg * 2,
                  maxHeight: size + theme.spacing.lg * 2,
                  paddingVertical: theme.spacing.lg,
                  paddingLeft: screenWidth * 0.15,
                }}
                ListFooterComponent={() => (
                  <View style={{ width: screenWidth * 0.15 * 2 }} />
                )}
                ItemSeparatorComponent={() => (
                  <View style={{ width: theme.spacing.lg }} />
                )}
                renderItem={({ item }) => (
                  <Image
                    source={{ uri: `https://assets.toylandapp.com/${item}` }}
                    style={{
                      width: size,
                      height: size,
                      borderRadius: theme.spacing.lg,
                      backgroundColor: theme.colors.foreground,
                    }}
                  />
                )}
                ListEmptyComponent={() => (
                  <View
                    style={{
                      width: size,
                      height: size,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <ActivityIndicator size={24} color={theme.colors.primary} />
                  </View>
                )}
              />
              <View style={{ padding: theme.spacing.lg, paddingBottom: 0 }}>
                <Text
                  style={{
                    fontFamily: "QuicksandBold",
                    fontSize: 32,
                    marginBottom: theme.spacing.lg,
                  }}
                >
                  {product.name}
                </Text>
                {product.description && (
                  <Text
                    style={{
                      fontFamily: "QuicksandMedium",
                      fontSize: 16,
                      marginBottom: theme.spacing.lg,
                      color: theme.colors.text,
                    }}
                  >
                    {product.description}
                  </Text>
                )}
              </View>
            </>
          )}
          renderItem={({ item, index, section }) => (
            <View
              style={{
                borderWidth: 2,
                borderBottomWidth: index === section.data.length - 1 ? 2 : 0,
                borderColor: theme.colors.border,
                borderTopEndRadius: index === 0 ? theme.spacing.lg : 0,
                borderTopStartRadius: index === 0 ? theme.spacing.lg : 0,
                borderBottomEndRadius:
                  index === section.data.length - 1 ? theme.spacing.lg : 0,
                borderBottomStartRadius:
                  index === section.data.length - 1 ? theme.spacing.lg : 0,
                padding: theme.spacing.lg,
                marginHorizontal: theme.spacing.lg,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "QuicksandBold",
                  fontSize: 16,
                }}
              >
                {item.title}
              </Text>
              <Text
                style={{
                  fontFamily: "QuicksandBold",
                  fontSize: 16,
                  color: theme.colors.text,
                }}
              >
                {item.value}
              </Text>
            </View>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text
              style={{
                fontFamily: "QuicksandBold",
                fontSize: 16,
                margin: theme.spacing.lg,
              }}
            >
              {title}
            </Text>
          )}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={() => (
            <View style={{ padding: theme.spacing.lg, gap: theme.spacing.lg }}>
              {product?.listing && (
                <Button
                  variant="outline"
                  onPress={() =>
                    router.push({
                      pathname: "/marketplace/[id]",
                      params: { id: product.listing!.id },
                    })
                  }
                >
                  Ver Anúncio
                </Button>
              )}
              {product.status === "available" ? (
                <>
                  <PublishOnMarketplace id={product.id} />
                  <DeleteProduct id={product.id} />
                </>
              ) : null}
            </View>
          )}
          ListFooterComponentStyle={{
            marginTop: theme.spacing.lg,
            marginBottom: theme.spacing.lg * 3,
          }}
        />
      )}
    </View>
  );
}
