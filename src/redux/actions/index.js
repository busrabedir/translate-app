import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

// dil verilerini getiricek thunk aksiyonu
export const getLanguages = createAsyncThunk(
  "language/getLanguages",
  async () => {
    // api'dan dil verilerini al
    const res = await api.get("/languages");

    // aksiyonun payload'ını return et
    return res.data.languages;
  }
);

// çeviri işlemini yapacak thunk aksiyonu
export const translateText = createAsyncThunk(
  "translate/translateText",
  async (_, { getState }) => {
    // thunk aksiyonu içerisinden storeda tutulan veriye erişme
    const state = getState().translate;

    // api'a çeviri için istek at
    const res = await api.post("", {
      q: state.textToTranslate,
      source: state.sourceLang.value,
      target: state.targetLang.value,
    });

    //aksiyonun payloadını return et
    return res.data.data.translations.translatedText[0];
  }
);
