import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, BookOpen, Clapperboard, Zap, Sparkles } from "lucide-react";
import { useLocation } from "wouter";

/**
 * 主页面 - AI漫剧剧本生成器
 * 设计风格：现代极简主义 + 深色工作区
 * 色彩系统：深灰蓝背景 + 霓虹蓝/紫罗兰强调
 * 排版：Poppins（标题）+ Inter（正文）
 */
export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const [, navigate] = useLocation();

  const handleStartProject = () => {
    navigate("/editor");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 p-2">
              <Clapperboard className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              AI漫剧剧本生成器
            </h1>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              功能介绍
            </a>
            <a href="#workflow" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              工作流程
            </a>
            <Button onClick={handleStartProject} className="bg-primary hover:bg-primary/90">
              开始使用
            </Button>
          </nav>
        </div>
      </header>

      {/* 英雄区域 */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('/images/hero-background.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background" />

        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block mb-6 px-4 py-2 rounded-full border border-primary/30 bg-primary/10">
              <span className="text-sm font-medium text-primary flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                由 Gemini Pro 驱动的 AI 工具
              </span>
            </div>

            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              将小说转变为
              <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                {" "}漫剧剧本
              </span>
            </h2>

            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              从长篇小说到短剧分镜，一键自动生成符合节奏的剧本。利用 AI
              智能拆解故事，规划分镜镜头，让创意工作变得高效而专业。
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                onClick={handleStartProject}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white"
              >
                立即开始 <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-primary/30 hover:bg-primary/10"
              >
                查看演示
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 工作流程展示 */}
      <section id="workflow" className="py-20 md:py-32 border-t border-border">
        <div className="container">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">完整的工作流程</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              从小说到剧本，从分镜到规划，每一步都由 AI 智能驱动
            </p>
          </div>

          <div className="relative">
            <img
              src="/images/workflow-illustration.png"
              alt="工作流程"
              className="w-full rounded-lg border border-primary/20"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {[
              {
                icon: BookOpen,
                title: "小说转剧本",
                description: "将长篇小说自动改写为第一人称 OS + 台词形式的剧本",
              },
              {
                icon: Clapperboard,
                title: "分镜拆解",
                description: "按照独立动作单元拆解剧本，生成标准化的分镜方案",
              },
              {
                icon: Zap,
                title: "节奏规划",
                description: "根据爽文套路自动筛选分镜，规划每集的叙事节奏",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="p-8 bg-card/50 border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
              >
                <div className="mb-4 inline-block p-3 rounded-lg bg-primary/10">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h4 className="text-lg font-semibold mb-3">{item.title}</h4>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 功能特性 */}
      <section id="features" className="py-20 md:py-32 border-t border-border">
        <div className="container">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">核心功能</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              专业级的编辑工具，为创意工作者设计
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "智能提示词模板",
                description: "内置专业的分镜拆解提示词，基于罗伯特·麦基的镜头理论",
              },
              {
                title: "实时预览",
                description: "编辑时实时预览分镜效果，即时反馈工作进度",
              },
              {
                title: "节奏规划器",
                description: "根据爽文套路自动规划分镜顺序，计算镜头时长",
              },
              {
                title: "可视化管理",
                description: "拖拽调整分镜顺序，直观管理整个项目工作流",
              },
              {
                title: "多项目支持",
                description: "同时管理多个小说项目，轻松切换和对比",
              },
              {
                title: "导出功能",
                description: "支持导出为多种格式，方便后续制作和协作",
              },
            ].map((feature, index) => (
              <div key={index} className="flex gap-4 p-6 rounded-lg border border-border/50 hover:border-primary/30 transition-colors">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 区域 */}
      <section className="py-20 md:py-32 border-t border-border">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center p-12 rounded-lg border border-primary/20 bg-gradient-to-br from-primary/10 to-accent/10">
            <h3 className="text-3xl font-bold mb-4">准备好开始了吗？</h3>
            <p className="text-muted-foreground mb-8">
              上传你的小说，让 AI 为你自动生成专业的漫剧剧本。
            </p>
            <Button
              onClick={handleStartProject}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white"
            >
              开始创作 <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="border-t border-border py-12 text-center text-sm text-muted-foreground">
        <div className="container">
          <p>
            AI漫剧剧本生成器 © 2024 | 由 Gemini Pro 驱动
          </p>
        </div>
      </footer>
    </div>
  );
}
