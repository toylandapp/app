import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createAddressSlice, type AddressSlice } from "./address";
import { createAuthSlice, type AuthSlice } from "./auth";
import { createProductSlice, type ProductSlice } from "./product";
import { createUserSlice, type UserSlice } from "./user";

const useBoundStore = create<
  AuthSlice & UserSlice & ProductSlice & AddressSlice
>()((...a) => ({
  ...persist(createAuthSlice, {
    name: "auth-store",
    storage: createJSONStorage(() => AsyncStorage),
  })(...a),
  ...createUserSlice(...a),
  ...createProductSlice(...a),
  ...createAddressSlice(...a),
}));

export default useBoundStore;
