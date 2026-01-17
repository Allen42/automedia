import path from 'path';
import fs from 'fs';
import { createCanvas } from 'canvas';
import ffmpeg from 'fluent-ffmpeg';
/**
 * 生成分镜图像
 */
function generateStoryboardImage(storyboard) {
    try {
        // 创建 Canvas（1920x1080）
        const canvas = createCanvas(1920, 1080);
        const ctx = canvas.getContext('2d');
        // 背景色
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, 1920, 1080);
        // 标题
        ctx.fillStyle = '#0ea5e9';
        ctx.font = 'bold 48px Arial';
        ctx.fillText(`镜头 ${storyboard.number}`, 60, 100);
        // 信息区域
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '24px Arial';
        let y = 180;
        const lineHeight = 50;
        ctx.fillText(`时间: ${storyboard.time}`, 60, y);
        y += lineHeight;
        ctx.fillText(`地点: ${storyboard.location}`, 60, y);
        y += lineHeight;
        ctx.fillText(`景别: ${storyboard.shotType}`, 60, y);
        y += lineHeight;
        ctx.fillText(`时长: ${storyboard.duration}秒`, 60, y);
        y += lineHeight + 20;
        // 动作描写
        ctx.fillStyle = '#a855f7';
        ctx.font = 'bold 28px Arial';
        ctx.fillText('动作描写:', 60, y);
        y += 50;
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '20px Arial';
        const actionLines = wrapText(ctx, storyboard.action, 1800, 25);
        actionLines.forEach((line) => {
            ctx.fillText(line, 80, y);
            y += 40;
        });
        y += 20;
        // 情绪
        ctx.fillStyle = '#a855f7';
        ctx.font = 'bold 28px Arial';
        ctx.fillText('情绪:', 60, y);
        y += 50;
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '20px Arial';
        ctx.fillText(storyboard.emotion, 80, y);
        return canvas.toBuffer('image/png');
    }
    catch (error) {
        console.error('生成分镜图像失败:', error);
        throw error;
    }
}
/**
 * 文本换行
 */
function wrapText(ctx, text, maxWidth, lineHeight) {
    const words = text.split('');
    const lines = [];
    let currentLine = '';
    for (const word of words) {
        const testLine = currentLine + word;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && currentLine !== '') {
            lines.push(currentLine);
            currentLine = word;
        }
        else {
            currentLine = testLine;
        }
    }
    if (currentLine !== '') {
        lines.push(currentLine);
    }
    return lines;
}
/**
 * 导出视频
 */
export async function exportVideo(storyboards, outputPath) {
    return new Promise(async (resolve, reject) => {
        try {
            // 创建临时目录存放图像
            const tempDir = path.join(outputPath, '.temp_storyboards');
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true });
            }
            // 生成分镜图像
            console.log('正在生成分镜图像...');
            const imagePaths = [];
            for (let i = 0; i < storyboards.length; i++) {
                const storyboard = storyboards[i];
                const imageBuffer = generateStoryboardImage(storyboard);
                const imagePath = path.join(tempDir, `storyboard_${String(i + 1).padStart(3, '0')}.png`);
                fs.writeFileSync(imagePath, imageBuffer);
                imagePaths.push(imagePath);
            }
            // 生成视频
            console.log('正在生成视频...');
            const timestamp = new Date().getTime();
            const videoPath = path.join(outputPath, `漫剧_${timestamp}.mp4`);
            // 创建 FFmpeg 命令
            const firstImage = imagePaths[0];
            const duration = storyboards.reduce((sum, sb) => sum + (sb.duration || 5), 0);
            ffmpeg(firstImage)
                .inputOptions(['-loop', '1'])
                .inputOptions(['-t', String(duration)])
                .outputOptions([
                '-c:v',
                'libx264',
                '-pix_fmt',
                'yuv420p',
                '-r',
                '30',
                '-vf',
                `scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2`,
            ])
                .output(videoPath)
                .on('end', () => {
                console.log('视频生成完成:', videoPath);
                // 清理临时文件
                imagePaths.forEach((imagePath) => {
                    try {
                        fs.unlinkSync(imagePath);
                    }
                    catch (error) {
                        console.warn('删除临时文件失败:', imagePath);
                    }
                });
                try {
                    fs.rmdirSync(tempDir);
                }
                catch (error) {
                    console.warn('删除临时目录失败:', tempDir);
                }
                resolve(videoPath);
            })
                .on('error', (error) => {
                console.error('视频生成失败:', error);
                reject(error);
            })
                .run();
        }
        catch (error) {
            console.error('导出视频失败:', error);
            reject(error);
        }
    });
}
