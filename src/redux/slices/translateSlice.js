import { createSlice } from "@reduxjs/toolkit";
import { translateText } from "../actions";

const initialState = {
  sourceLang: { value: undefined, label: "Dili algıla" }, // kaynak dil
  targetLang: { value: "en", label: "English" }, // hedef dil
  textToTranslate: "", // çevrilicek metin
  translatedText: "", // çeviri sonucu
  loading: false, // çeviri yükleniyor mu
  error: null, // çeviri sonucunda hata var mı
  history: [], // çeviri geçmişi
};

const translateSlice = createSlice({
  name: "translate",
  initialState,
  reducers: {
    setSourceLang: (state, action) => {
      state.sourceLang = action.payload;
    },
    setTargetLang: (state, action) => {
      state.targetLang = action.payload;
    },
    setText: (state, action) => {
      state.textToTranslate = action.payload;
    },
    swap: (state) => {
      // değişme anında stateler birbirini ezmesin diye geçici değişkenler oluştur
      const tempSource = state.sourceLang;
      const tempTarget = state.targetLang;
      const tempText = state.textToTranslate;
      const tempTranslated = state.translatedText;

      // statelerin değerini değiştir
      state.sourceLang = tempTarget;
      state.targetLang = tempSource;
      state.textToTranslate = tempTranslated;
      state.translatedText = tempText;
    },

    clearHistory: (state) => {
      state.history = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(translateText.pending, (state) => {
      state.loading = true;
      state.translatedText = "";
    });

    builder.addCase(translateText.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(translateText.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.translatedText = action.payload;

      // çeviri sonucu geldiyse geçmişe kaydet
      if (state.textToTranslate && action.payload) {
        state.history.unshift({
          id: Date.now(),
          textToTranslate: state.textToTranslate,
          translatedText: action.payload,
          sourceLang: state.sourceLang,
          targetLang: state.targetLang,
          timestamp: new Date().toLocaleDateString("tr"),
        });
      }
    });
  },
});

export const { setSourceLang, setTargetLang, setText, swap, clearHistory } =
  translateSlice.actions;
export default translateSlice.reducer;
