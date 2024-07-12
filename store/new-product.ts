import apiFetch from "@/utils/api-fetch";
import * as ExpoImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { z } from "zod";
import { StateCreator } from "zustand";
import { AuthSlice } from "./auth";
import { UserSlice } from "./user";
export interface Product {
  id: string;
  name: string;
  description: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  images: string[];
}

export const createProductSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  // status: z
  //   .enum([
  //     "available",
  //     "unavailable",
  //     "loan", // emprestado para alguém
  //     "loaned", // emprestado por alguém
  //     "for-sale",
  //     "sold",
  //     "donated",
  //   ])
  //   .default("available"),
});

interface State {
  newProductImages: ExpoImagePicker.ImagePickerAsset[];
  newProductLoading: boolean;
  products: Product[];
  productsLoading: boolean;
  deleteProductLoading: boolean;
}

interface Actions {
  resetNewProduct: () => void;
  setNewProductImages: (images: ExpoImagePicker.ImagePickerAsset[]) => void;
  createProduct: (input: z.infer<typeof createProductSchema>) => Promise<void>;
  fetchProduct: (productId: string) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
}

export type NewProductSlice = State & Actions;

const initialState: State = {
  newProductImages: [],
  newProductLoading: false,
  products: [],
  productsLoading: false,
  deleteProductLoading: false,
};

export const createNewProductSlice: StateCreator<
  NewProductSlice & AuthSlice & UserSlice,
  [],
  [],
  NewProductSlice
> = (set, get) => ({
  ...initialState,
  setNewProductImages: (images) => {
    set({ newProductImages: images });
  },
  createProduct: async (input) => {
    set({ newProductLoading: true });
    try {
      const response = await apiFetch(
        get,
        "POST",
        "/products",
        JSON.stringify(input)
      );
      if (!response.ok) throw new Error("Erro ao criar produto");
      const product = await response.json();

      const formData = new FormData();

      const images = get().newProductImages;

      images.forEach((image) => {
        formData.append("file", {
          uri: image?.uri,
          name: `image.${image?.uri.split(".").pop()}`,
          type: `image/${image?.uri.split(".").pop()}`,
        } as any);
      });

      await apiFetch(get, "POST", `/products/${product.id}/images`, formData);

      router.replace("/(tabs)/profile");
    } catch (error) {
      console.error(error);
    } finally {
      set({ newProductLoading: false });
    }
  },
  fetchProduct: async (productId) => {
    set({ productsLoading: true });
    try {
      const response = await apiFetch(get, "GET", `/products/${productId}`);
      if (!response.ok) throw new Error("Erro ao buscar produto");
      const product = await response.json();
      set((state) => ({ products: [...state.products, product] }));
    } catch (error) {
      console.error(error);
    } finally {
      set({ productsLoading: false });
    }
  },
  deleteProduct: async (productId) => {
    set({ deleteProductLoading: true });
    try {
      const response = await apiFetch(get, "DELETE", `/products/${productId}`);
      if (!response.ok) throw new Error("Erro ao deletar produto");
      set((state) => ({
        products: state.products.filter((p) => p.id !== productId),
      }));
      router.replace("/(tabs)/profile");
    } catch (error) {
      console.error(error);
    } finally {
      set({ deleteProductLoading: false });
    }
  },
  resetNewProduct: () => set(initialState),
});
