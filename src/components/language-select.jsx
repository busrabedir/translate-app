import { ArrowLeftRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import ReactSelect from "react-select";
import { customStyles } from "../constants";
import { useMemo } from "react";
import {
  setSourceLang,
  setTargetLang,
  swap,
} from "../redux/slices/translateSlice";

const LanguageSelect = () => {
  const dispatch = useDispatch();
  const { loading, error, languages } = useSelector((store) => store.language);
  const { sourceLang, targetLang } = useSelector((store) => store.translate);

  /*
   * React select options verisini [{value,label}] formatında istediği için api'dan gelen veriyi güncelle.
   * language > value
   * name > label
   */

  const formatted = useMemo(
    () =>
      languages.map((item) => ({
        value: item.language,
        label: item.name,
      })),
    [languages]
  );

  // Dili algıla seçeneği
  const detect = { label: "Dili algıla", value: undefined };

  // değişme anında çalışır
  const handleSwap = () => {
    dispatch(swap());
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-col lg:flex-row">
        {/* Kaynak Dil */}
        <div className="flex-1 w-full">
          <label className="block text-sm text-zinc-300 mb-2">Kaynak Dil</label>

          <ReactSelect
            options={[detect, ...formatted]}
            className="text-black"
            styles={customStyles}
            value={sourceLang}
            isLoading={loading}
            isDisabled={loading}
            onChange={(lang) => {
              if (lang.value === targetLang.value) {
                return handleSwap();
              }
              dispatch(setSourceLang(lang));
            }}
          />
        </div>

        {/* Değiştirme Butonu*/}
        <div className="flex items-center justify-center">
          <button
            disabled={!sourceLang.value}
            onClick={handleSwap}
            className="size-10 lg:size-12 bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-800 disabled:opacity-50 rounded-full flex justify-center items-center cursor-pointer"
          >
            <ArrowLeftRight className="size-5" />
          </button>
        </div>

        {/* Hedef Dil */}
        <div className="flex-1 w-full">
          <label className="block text-sm text-zinc-300 mb-2">Hedef Dil</label>

          <ReactSelect
            options={formatted}
            className="text-black"
            styles={customStyles}
            value={targetLang}
            isLoading={loading}
            isDisabled={loading}
            onChange={(lang) => {
              if (lang.value === sourceLang.value) {
                return handleSwap();
              }
              dispatch(setTargetLang(lang));
            }}
          />
        </div>
      </div>

      {/* Dil sayısı */}
      <div className="text-center">
        <p className="text-xs text-zinc-500">
          {languages.length} dil destekleniyor
        </p>
      </div>
    </div>
  );
};

export default LanguageSelect;
