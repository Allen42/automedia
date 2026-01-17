import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Upload,
  Plus,
  Trash2,
  Copy,
  Download,
  Settings,
  ChevronRight,
  Film,
  Zap,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useGemini } from "@/hooks/useGemini";

/**
 * 编辑器页面 - 核心工作区
 * 设计风格：现代极简主义 + 深色工作区
 * 布局：三栏式（左导航 + 中编辑 + 右预览）
 */

interface Project {
  id: string;
  name: string;
  novelContent: string;
  scriptContent: string;
  storyboardsText: string;
  storyboards: Storyboard[];
  rhythmPlan: string;
  createdAt: Date;
}

interface Storyboard {
  id: string;
  number: number;
  time: string;
  location: string;
  shotType: string;
  action: string;
  result: string;
  emotion: string;
  duration: number;
  imageUrl?: string;
}

export default function Editor() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState("novel");
  const [projectName, setProjectName] = useState("");
  const [generatingImages, setGeneratingImages] = useState<Record<string, boolean>>({});
  const { loading, error, handleNovelToScript, handleDecomposeToStoryboards, handlePlanRhythm, handleGenerateImage, parseStoryboards } = useGemini();

  const handleCreateProject = () => {
    if (!projectName.trim()) {
      toast.error("请输入项目名称");
      return;
    }

    const newProject: Project = {
      id: Date.now().toString(),
      name: projectName,
      novelContent: "",
      scriptContent: "",
      storyboardsText: "",
      storyboards: [],
      rhythmPlan: "",
      createdAt: new Date(),
    };

    setProjects([...projects, newProject]);
    setCurrentProject(newProject);
    setProjectName("");
    toast.success("项目创建成功");
  };

  const handleUploadNovel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (currentProject) {
        const updated = {
          ...currentProject,
          novelContent: content,
        };
        setCurrentProject(updated);
        setProjects(
          projects.map((p) => (p.id === currentProject.id ? updated : p))
        );
        toast.success("小说已上传");
      }
    };
    reader.readAsText(file);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
    if (currentProject?.id === id) {
      setCurrentProject(null);
    }
    toast.success("项目已删除");
  };

  const handleConvertToScript = async () => {
    if (!currentProject?.novelContent) {
      toast.error("请先上传小说内容");
      return;
    }

    toast.loading("正在转换为剧本...");
    const result = await handleNovelToScript(currentProject.novelContent);
    
    if (result) {
      const updated = {
        ...currentProject,
        scriptContent: result,
      };
      setCurrentProject(updated);
      setProjects(
        projects.map((p) => (p.id === currentProject.id ? updated : p))
      );
      setActiveTab("script");
      toast.dismiss();
      toast.success("剧本转换完成");
    } else {
      toast.dismiss();
      toast.error(error || "剧本转换失败");
    }
  };

  const handleGenerateStoryboards = async () => {
    if (!currentProject?.scriptContent) {
      toast.error("请先生成剧本");
      return;
    }

    toast.loading("正在生成分镜...");
    const result = await handleDecomposeToStoryboards(currentProject.scriptContent);
    
    if (result) {
      const parsedStoryboards = parseStoryboards(result);
      const updated = {
        ...currentProject,
        storyboardsText: result,
        storyboards: parsedStoryboards,
      };
      setCurrentProject(updated);
      setProjects(
        projects.map((p) => (p.id === currentProject.id ? updated : p))
      );
      setActiveTab("storyboard");
      toast.dismiss();
      toast.success("分镜生成完成");
    } else {
      toast.dismiss();
      toast.error(error || "分镜生成失败");
    }
  };

  const handlePlanRhythmClick = async () => {
    if (!currentProject?.storyboardsText) {
      toast.error("请先生成分镜");
      return;
    }

    toast.loading("正在规划节奏...");
    const result = await handlePlanRhythm(currentProject.storyboardsText);
    
    if (result) {
      const updated = {
        ...currentProject,
        rhythmPlan: result,
      };
      setCurrentProject(updated);
      setProjects(
        projects.map((p) => (p.id === currentProject.id ? updated : p))
      );
      toast.dismiss();
      toast.success("节奏规划完成");
    } else {
      toast.dismiss();
      toast.error(error || "节奏规划失败");
    }
  };

  const handleGenerateImageClick = async (storyboardId: string) => {
      const storyboard = currentProject?.storyboards.find(s => s.id === storyboardId);
      if (!storyboard) return;

      setGeneratingImages(prev => ({ ...prev, [storyboardId]: true }));
      toast.loading(`正在为镜头 ${storyboard.number} 生成画面...`);

      const imageUrl = await handleGenerateImage(storyboard);
      
      if (imageUrl) {
          const updatedStoryboards = currentProject!.storyboards.map(s => 
              s.id === storyboardId ? { ...s, imageUrl } : s
          );
          
          const updatedProject = { ...currentProject!, storyboards: updatedStoryboards };
          setCurrentProject(updatedProject);
          setProjects(projects.map(p => p.id === currentProject!.id ? updatedProject : p));
          
          toast.dismiss();
          toast.success(`镜头 ${storyboard.number} 画面生成成功`);
      } else {
          toast.dismiss();
          toast.error("画面生成失败");
      }
      
      setGeneratingImages(prev => ({ ...prev, [storyboardId]: false }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* 顶部工具栏 */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <Film className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">
              {currentProject?.name || "新建项目"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              设置
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              导出
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* 左侧导航栏 */}
        <aside className="w-64 border-r border-border bg-card/30 overflow-y-auto">
          <div className="p-6">
            <div className="mb-6">
              <Label className="text-xs font-semibold text-muted-foreground mb-3 block">
                项目名称
              </Label>
              <div className="flex gap-2">
                <Input
                  placeholder="输入项目名称"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="text-sm"
                />
                <Button
                  onClick={handleCreateProject}
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mb-6">
              <Label className="text-xs font-semibold text-muted-foreground mb-3 block">
                我的项目
              </Label>
              <div className="space-y-2">
                {projects.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-4">
                    暂无项目，创建一个新项目开始
                  </p>
                ) : (
                  projects.map((project) => (
                    <div
                      key={project.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        currentProject?.id === project.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/30"
                      }`}
                      onClick={() => setCurrentProject(project)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium truncate">
                          {project.name}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProject(project.id);
                          }}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleConvertToScript}
                disabled={!currentProject || loading}
                className="w-full bg-primary hover:bg-primary/90"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    转换中...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    转换为剧本
                  </>
                )}
              </Button>
              <Button
                onClick={handleGenerateStoryboards}
                disabled={!currentProject?.scriptContent || loading}
                variant="outline"
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <Film className="h-4 w-4 mr-2" />
                    生成分镜
                  </>
                )}
              </Button>
              <Button
                onClick={handlePlanRhythmClick}
                disabled={!currentProject?.storyboardsText || loading}
                variant="outline"
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    规划中...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    规划节奏
                  </>
                )}
              </Button>
            </div>
          </div>
        </aside>

        {/* 中央编辑区 */}
        <main className="flex-1 overflow-y-auto">
          {!currentProject ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Film className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">
                  选择或创建一个项目
                </h3>
                <p className="text-muted-foreground">
                  在左侧创建新项目开始工作
                </p>
              </div>
            </div>
          ) : (
            <div className="p-8">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4 mb-8">
                  <TabsTrigger value="novel">小说</TabsTrigger>
                  <TabsTrigger value="script">剧本</TabsTrigger>
                  <TabsTrigger value="storyboard">分镜</TabsTrigger>
                  <TabsTrigger value="rhythm">节奏</TabsTrigger>
                </TabsList>

                {/* 小说标签页 */}
                <TabsContent value="novel" className="space-y-4">
                  <Card className="p-6 border-border/50">
                    <h3 className="text-lg font-semibold mb-4">上传小说</h3>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90">
                          <Upload className="h-4 w-4 mr-2" />
                          选择文件
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>上传小说文件</DialogTitle>
                          <DialogDescription>
                            支持 .txt 格式的小说文件
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Input
                            type="file"
                            accept=".txt"
                            onChange={handleUploadNovel}
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </Card>

                  {currentProject.novelContent && (
                    <Card className="p-6 border-border/50">
                      <h4 className="font-semibold mb-4">小说预览</h4>
                      <Textarea
                        value={currentProject.novelContent}
                        onChange={(e) => {
                          const updated = {
                            ...currentProject,
                            novelContent: e.target.value,
                          };
                          setCurrentProject(updated);
                          setProjects(
                            projects.map((p) =>
                              p.id === currentProject.id ? updated : p
                            )
                          );
                        }}
                        className="h-96 font-mono text-sm"
                        placeholder="小说内容将显示在这里..."
                      />
                    </Card>
                  )}
                </TabsContent>

                {/* 剧本标签页 */}
                <TabsContent value="script" className="space-y-4">
                  <Card className="p-6 border-border/50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">剧本内容</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (currentProject.scriptContent) {
                            navigator.clipboard.writeText(
                              currentProject.scriptContent
                            );
                            toast.success("已复制到剪贴板");
                          }
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea
                      value={currentProject.scriptContent}
                      onChange={(e) => {
                        const updated = {
                          ...currentProject,
                          scriptContent: e.target.value,
                        };
                        setCurrentProject(updated);
                        setProjects(
                          projects.map((p) =>
                            p.id === currentProject.id ? updated : p
                          )
                        );
                      }}
                      className="h-96 font-mono text-sm"
                      placeholder="转换后的剧本将显示在这里..."
                    />
                  </Card>
                </TabsContent>

                {/* 分镜标签页 */}
                <TabsContent value="storyboard" className="space-y-4">
                  <Card className="p-6 border-border/50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">分镜规划</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (currentProject.storyboardsText) {
                            navigator.clipboard.writeText(
                              currentProject.storyboardsText
                            );
                            toast.success("已复制到剪贴板");
                          }
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    {currentProject.storyboards.length === 0 ? (
                      <div className="text-center py-12">
                        <Film className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                        <p className="text-muted-foreground">
                          暂无分镜数据，点击"生成分镜"开始
                        </p>
                      </div>
                    ) : (

                      <div className="space-y-4">
                        {currentProject.storyboards.map((sb) => (
                          <div
                            key={sb.id}
                            className="p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-colors flex gap-4"
                          >
                             {/* 画面预览区域 */}
                             <div className="w-48 h-28 bg-muted/30 rounded-md flex-shrink-0 overflow-hidden relative group border border-border/30">
                                {sb.imageUrl ? (
                                    <img src={sb.imageUrl} alt={`镜头 ${sb.number}`} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/50">
                                        <ImageIcon className="h-6 w-6 mb-1" />
                                        <span className="text-xs">暂无画面</span>
                                    </div>
                                )}
                                
                                {/* 悬浮生成按钮 */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button 
                                        size="sm" 
                                        variant="secondary" 
                                        className="h-8 text-xs"
                                        onClick={() => handleGenerateImageClick(sb.id)}
                                        disabled={generatingImages[sb.id]}
                                    >
                                        {generatingImages[sb.id] ? (
                                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                        ) : (
                                            <Zap className="h-3 w-3 mr-1" />
                                        )}
                                        {sb.imageUrl ? "重新生成" : "AI 生图"}
                                    </Button>
                                </div>
                             </div>

                             {/* 文本信息区域 */}
                             <div className="flex-1">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h4 className="font-semibold">
                                        镜头 {sb.number}
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                        {sb.time} · {sb.location}
                                        </p>
                                    </div>
                                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                                        {sb.duration}秒
                                    </span>
                                </div>
                                <p className="text-sm mb-2">{sb.action}</p>
                                <p className="text-xs text-muted-foreground">
                                {sb.emotion}
                                </p>
                             </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                </TabsContent>

                {/* 节奏规划标签页 */}
                <TabsContent value="rhythm" className="space-y-4">
                  <Card className="p-6 border-border/50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">节奏规划</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (currentProject.rhythmPlan) {
                            navigator.clipboard.writeText(
                              currentProject.rhythmPlan
                            );
                            toast.success("已复制到剪贴板");
                          }
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    {!currentProject.rhythmPlan ? (
                      <div className="text-center py-12">
                        <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                        <p className="text-muted-foreground">
                          暂无节奏规划，点击"规划节奏"开始
                        </p>
                      </div>
                    ) : (
                      <Textarea
                        value={currentProject.rhythmPlan}
                        onChange={(e) => {
                          const updated = {
                            ...currentProject,
                            rhythmPlan: e.target.value,
                          };
                          setCurrentProject(updated);
                          setProjects(
                            projects.map((p) =>
                              p.id === currentProject.id ? updated : p
                            )
                          );
                        }}
                        className="h-96 font-mono text-sm"
                        placeholder="节奏规划将显示在这里..."
                      />
                    )}
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </main>

        {/* 右侧预览面板 */}
        <aside className="w-80 border-l border-border bg-card/30 overflow-y-auto hidden lg:block">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-6">实时预览</h3>

            {!currentProject ? (
              <div className="text-center py-12">
                <Film className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-sm text-muted-foreground">
                  选择项目查看预览
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground mb-2 block">
                    项目统计
                  </Label>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">小说字数</span>
                      <span className="font-semibold">
                        {currentProject.novelContent.length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">剧本字数</span>
                      <span className="font-semibold">
                        {currentProject.scriptContent.length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">分镜数量</span>
                      <span className="font-semibold">
                        {currentProject.storyboards.length}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <Label className="text-xs font-semibold text-muted-foreground mb-3 block">
                    快速操作
                  </Label>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      disabled={!currentProject.novelContent}
                    >
                      <ChevronRight className="h-4 w-4 mr-2" />
                      查看提示词
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      disabled={!currentProject.scriptContent}
                    >
                      <ChevronRight className="h-4 w-4 mr-2" />
                      编辑提示词
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      disabled={currentProject.storyboards.length === 0}
                    >
                      <ChevronRight className="h-4 w-4 mr-2" />
                      导出分镜
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
