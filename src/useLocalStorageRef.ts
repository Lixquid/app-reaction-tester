import { ref, watch } from "@vue/composition-api";

export default function useLocalStorageRef<T>(key: string, def: T) {
    const initialJSON = localStorage.getItem(key);

    const out = ref(
        initialJSON !== null ? (JSON.parse(initialJSON) as T) : def
    );

    watch(out, newV => localStorage.setItem(key, JSON.stringify(newV)), {
        lazy: true
    });

    return out;
}
