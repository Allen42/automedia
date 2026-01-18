import path from 'path';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
/**
 * 导出视频 (基于图片序列)
 */
export async function exportVideo(storyboards, outputPath) {
    return new Promise(async (resolve, reject) => {
        let tempDir = '';
        try {
            // 1. 创建临时目录
            const timestamp = new Date().getTime();
            tempDir = path.join(outputPath, `.temp_manju_frames_${timestamp}`);
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true });
            }
            console.log('正在准备视频素材...', tempDir);
            const fileListLines = [];
            let hasImages = false;
            // 2. 处理每一帧
            for (let i = 0; i < storyboards.length; i++) {
                const sb = storyboards[i];
                // 默认显示时长 3秒，或者使用设定时长
                const duration = sb.duration || 3;
                let imagePath = '';
                if (sb.imageUrl && sb.imageUrl.startsWith('data:image')) {
                    // 保存 Base64 图片
                    const base64Data = sb.imageUrl.replace(/^data:image\/\w+;base64,/, "");
                    const buffer = Buffer.from(base64Data, 'base64');
                    imagePath = path.join(tempDir, `frame_${String(i).padStart(3, '0')}.png`);
                    fs.writeFileSync(imagePath, buffer);
                    hasImages = true;
                }
                else {
                    console.warn(`镜头 ${sb.number} 缺少 AI 图片，跳过视频合成。`);
                    // TODO: 生成纯色占位图? 暂时跳过，这意味着视频会黑屏或者少一段
                    // 为保证视频完整性，如果缺失图片，应该生成一个黑底文字图？
                    // 由于移除 canvas 依赖，这里暂时不做 fallback，或后续添加简单的 buffer 生成
                    continue;
                }
                // 写入 concat 列表格式 (注意 Windows 路径转义)
                // file 'C:\path\to\file.png'
                // duration 5
                const safePath = imagePath.replace(/\\/g, '/');
                fileListLines.push(`file '${safePath}'`);
                fileListLines.push(`duration ${duration}`);
            }
            if (!hasImages) {
                throw new Error("没有有效的图片数据，无法生成视频。请先进行 AI 生图。");
            }
            // FFmpeg concat demuxer 的特别规则：最后一张图必须重复一次条目（不带 duration）或者是作为一个流的结束。
            // 标准做法是让最后一个条目也有 duration，这样它会持续显示。
            // 但是有些 ffmpeg 版本若最后一条有 duration，可能会卡住或者黑屏。
            // 这里的做法是列表里的 duration 实际上是"这条目显示多久后切换到下一条"。
            // 下一条如果没有，就是结束。所以最后一个 duration 是有效的。
            // 为了保险，有些教程建议重复最后一帧。暂时按标准尝试。
            const listPath = path.join(tempDir, 'input.txt');
            fs.writeFileSync(listPath, fileListLines.join('\n'));
            // 3. 生成视频
            console.log('正在调用 FFmpeg 合成视频...');
            const videoFilename = `Manju_Video_${timestamp}.mp4`;
            const videoPath = path.join(outputPath, videoFilename);
            ffmpeg()
                .input(listPath)
                .inputOptions(['-f', 'concat', '-safe', '0'])
                .outputOptions([
                '-c:v', 'libx264',
                '-pix_fmt', 'yuv420p',
                '-r', '30', // 30 fps
                '-vf', 'scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2' // 统一缩放
            ])
                .output(videoPath)
                .on('start', (cmd) => {
                console.log('FFmpeg 命令:', cmd);
            })
                .on('end', () => {
                console.log('视频生成完成:', videoPath);
                // 清理临时文件 (可选，由于是 electron 本地应用，保留在此以便调试，或者稍后删除)
                // fs.rmdirSync(tempDir, { recursive: true });
                resolve(videoPath);
            })
                .on('error', (err) => {
                console.error('FFmpeg 错误:', err);
                reject(new Error(`FFmpeg 生成失败: ${err.message}`));
            })
                .run();
        }
        catch (error) {
            console.error('导出视频流程异常:', error);
            reject(error);
        }
    });
}
