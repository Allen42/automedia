import { useState } from "react";
import {
  convertNovelToScript,
  decomposeToStoryboards,
  planRhythm,
  parseStoryboards,
} from "@/lib/geminiService";

interface UseGeminiState {
  loading: boolean;
  error: string | null;
}

export function useGemini() {
  const [state, setState] = useState<UseGeminiState>({
    loading: false,
    error: null,
  });

  const handleNovelToScript = async (novelContent: string): Promise<string | null> => {
    setState({ loading: true, error: null });
    try {
      const result = await convertNovelToScript(novelContent);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "未知错误";
      setState({ loading: false, error: errorMessage });
      return null;
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleDecomposeToStoryboards = async (
    scriptContent: string
  ): Promise<string | null> => {
    setState({ loading: true, error: null });
    try {
      const result = await decomposeToStoryboards(scriptContent);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "未知错误";
      setState({ loading: false, error: errorMessage });
      return null;
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const handlePlanRhythm = async (storyboards: string): Promise<string | null> => {
    setState({ loading: true, error: null });
    try {
      const result = await planRhythm(storyboards);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "未知错误";
      setState({ loading: false, error: errorMessage });
      return null;
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleGenerateImage = async (storyboard: any): Promise<string | null> => {
    // 这里也可以选择不共享全局 loading 状态，或者用特定的 key
    // 暂时共享全局 loading，但要注意 UI 上可能会全屏 loading，
    // 如果希望局部 loading，Editor.tsx 里需要自己维护一个 loading 状态 map
    // 为了简单，我们这里还是用 try/catch 但不一定要 set 全局 loading true
    // 让调用者（Editor）维护局部 loading 更好。
    // 但是为了统一，我们这里还是提供基本的 wrapper
    
    try {
       /* 
        Note: Image generation is slow. 
        Blocking global UI might be bad UX if doing many.
        But for single click, it's fine.
       */
       const result = await import("@/lib/geminiService").then(m => m.generateStoryboardImage(storyboard));
       return result;
    } catch (error) {
       console.error("Image gen error:", error);
       // Optional: set global error?
       return null;
    }
  };

  return {
    ...state,
    handleNovelToScript,
    handleDecomposeToStoryboards,
    handlePlanRhythm,
    handleGenerateImage,
    parseStoryboards,
  };
}
