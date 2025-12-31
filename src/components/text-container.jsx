import { ArrowRight, Volume2 } from "lucide-react";
import { setText } from "../redux/slices/translateSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./loader";

const TextContainer = () => {
  const { textToTranslate, translatedText, loading, sourceLang, targetLang } =
    useSelector((store) => store.translate);
  const dispatch = useDispatch();

  // çevrilecek metni temizler
  const handleClear = () => {
    dispatch(setText(""));
  };

  // çeviri sonucunu kopyalar
  const handleCopy = () => {
    window.navigator.clipboard.writeText(translatedText);
  };

  // kaynak metnini seslendir
  const handleSpeakSource = () => {
    // önceki seslendirmeyi iptal et
    window.speechSynthesis.cancel();

    // SpeechSynthesisUtterance: seslendirelecek metni ve ayarlarını tutan bir nesne oluşturur
    const uttarance = new SpeechSynthesisUtterance(textToTranslate);

    // uttarance.lang: hangi dilde/aksanda konuşulacağını belirler
    if (sourceLang.value) {
      uttarance.lang = sourceLang.value;
    }

    // oluşturulan uttarance nesnesini seslendirmeye başlar
    // tarayıcının ses sentezleme moturunu kullanarak sesli olarak okur
    window.speechSynthesis.speak(uttarance);
  };

  // hedef metnini seslendir
  const handleSpeakTarget = () => {
    window.speechSynthesis.cancel();

    const uttarance = new SpeechSynthesisUtterance(translatedText);

    if (targetLang.value) {
      uttarance.lang = targetLang.value;
    }

    window.speechSynthesis.speak(uttarance);
  };

  return (
    <div className="flex gap-4 mt-6 lg:gap-8 flex-col lg:flex-row">
      {/* Çevrilecek Metin */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-zinc-300">Çevirilecek Metin</label>

          {textToTranslate && (
            <div className="flex items-center gap-3">
              <button onClick={handleSpeakSource} className="btn">
                <Volume2 className="size-4" />
                Seslendir
              </button>
              <button onClick={handleClear} className="btn">
                Temizle
              </button>
            </div>
          )}
        </div>

        <div className="relative">
          <textarea
            placeholder="Çevirmek istediğiniz metni buraya yazınız"
            onChange={(e) => dispatch(setText(e.target.value))}
            value={textToTranslate}
          />
        </div>
      </div>

      {/* Icon */}
      <div className="flex items-center justify-center lg:flex-col">
        <div className="size-8 lg:size-12 bg-blue-600 rounded-full grid place-items-center">
          <ArrowRight className="size-4 lg:size-6 max-lg:rotate-90" />
        </div>
      </div>

      {/* Çeviri Sonucu*/}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-zinc-300">Çeviri Sonucu</label>

          {translatedText && (
            <div className="flex items-center gap-3">
              <button onClick={handleSpeakTarget} className="btn">
                <Volume2 className="size-4" />
                Seslendir
              </button>
              <button onClick={handleCopy} className="btn">
                Kopyala
              </button>
            </div>
          )}
        </div>

        <div className="relative">
          <textarea disabled className="text-gray-300" value={translatedText} />

          {loading && <Loader />}

          {!loading && !translatedText && !textToTranslate && (
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-zinc-500 text-sm">Çeviri bekleniyor...</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextContainer;
