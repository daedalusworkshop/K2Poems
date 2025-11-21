import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, ChevronDown, ChevronUp, Info } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type EasingType = "linear" | "easeIn" | "easeOut" | "easeInOut" | "anticipate" | "backInOut";
export type TransitionMode = "crossfade" | "fadeOut" | "wait";
export type FontWeight = "300" | "400" | "500" | "600" | "700";
export type LineHeight = "relaxed" | "loose" | "normal" | "snug";

export interface AnimationConfig {
  imageTransitions: boolean;
  imageFadeSpeed: number;
  imageEasing: EasingType;
  imageTransitionMode: TransitionMode;
  imageScale: boolean;
  imageScaleAmount: number;
  imageOpacity: number;
  imageBlur: number;
  poemFadeEffect: boolean;
  poemTransitionSpeed: number;
  poemOpacityInactive: number;
  poemBlurInactive: number;
  poemScaleInactive: number;
  smoothScrolling: boolean;
  textLetterSpacing: number;
  textLineHeight: LineHeight;
  titleFontWeight: FontWeight;
  bodyFontSize: number;
  dateUppercase: boolean;
  showDivider: boolean;
  borderOpacity: number;
}

interface AnimationSettingsProps {
  config: AnimationConfig;
  onConfigChange: (config: AnimationConfig) => void;
}

export function AnimationSettings({ config, onConfigChange }: AnimationSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const updateConfig = (key: keyof AnimationConfig, value: boolean | number | string) => {
    onConfigChange({ ...config, [key]: value });
  };

  const generateCode = () => {
    return `const [animationConfig, setAnimationConfig] = useState<AnimationConfig>({
  imageTransitions: ${config.imageTransitions},
  imageFadeSpeed: ${config.imageFadeSpeed},
  imageEasing: "${config.imageEasing}",
  imageTransitionMode: "${config.imageTransitionMode}",
  imageScale: ${config.imageScale},
  imageScaleAmount: ${config.imageScaleAmount},
  imageOpacity: ${config.imageOpacity},
  imageBlur: ${config.imageBlur},
  poemFadeEffect: ${config.poemFadeEffect},
  poemTransitionSpeed: ${config.poemTransitionSpeed},
  poemOpacityInactive: ${config.poemOpacityInactive},
  poemBlurInactive: ${config.poemBlurInactive},
  poemScaleInactive: ${config.poemScaleInactive},
  smoothScrolling: ${config.smoothScrolling},
  textLetterSpacing: ${config.textLetterSpacing},
  textLineHeight: "${config.textLineHeight}",
  titleFontWeight: "${config.titleFontWeight}",
  bodyFontSize: ${config.bodyFontSize},
  dateUppercase: ${config.dateUppercase},
  showDivider: ${config.showDivider},
  borderOpacity: ${config.borderOpacity},
});`;
  };

  const copyToClipboard = () => {
    const code = generateCode();
    navigator.clipboard.writeText(code).then(() => {
      alert("Code copied to clipboard! Paste this in client/src/pages/home.tsx to save your settings.");
    });
  };

  const easingOptions: { value: EasingType; label: string; description: string }[] = [
    { value: "linear", label: "Linear", description: "Constant speed throughout" },
    { value: "easeIn", label: "Ease In", description: "Starts slow, speeds up" },
    { value: "easeOut", label: "Ease Out", description: "Starts fast, slows down" },
    { value: "easeInOut", label: "Ease In-Out", description: "Smooth acceleration and deceleration" },
    { value: "anticipate", label: "Anticipate", description: "Slight backwards motion before forward" },
    { value: "backInOut", label: "Back In-Out", description: "Overshoots slightly for organic feel" },
  ];

  const transitionModeOptions: { value: TransitionMode; label: string; description: string }[] = [
    { value: "crossfade", label: "Crossfade", description: "Images blend together smoothly (no gap)" },
    { value: "fadeOut", label: "Fade Through", description: "Brief fade to background between images" },
    { value: "wait", label: "Wait", description: "First image fully disappears before next appears" },
  ];

  const lineHeightOptions: { value: LineHeight; label: string; description: string }[] = [
    { value: "snug", label: "Snug", description: "Compact, traditional poetry spacing" },
    { value: "normal", label: "Normal", description: "Standard book-like spacing" },
    { value: "relaxed", label: "Relaxed", description: "Breathing room between lines" },
    { value: "loose", label: "Loose", description: "Generous, airy spacing" },
  ];

  const fontWeightOptions: { value: FontWeight; label: string }[] = [
    { value: "300", label: "Light (300)" },
    { value: "400", label: "Regular (400)" },
    { value: "500", label: "Medium (500)" },
    { value: "600", label: "Semibold (600)" },
    { value: "700", label: "Bold (700)" },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 max-h-[80vh] flex flex-col">
      <motion.div
        initial={false}
        animate={{
          width: isOpen ? "380px" : "auto",
          height: isOpen ? "auto" : "auto",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-background/95 backdrop-blur-sm border border-border shadow-lg flex flex-col max-h-[80vh]"
      >
        {/* Header Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between gap-3 p-4 hover:bg-secondary/50 transition-colors border-b border-border"
        >
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-accent" />
            <span className="font-sans text-sm font-medium">Animation Settings</span>
          </div>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>

        {/* Save Settings Button */}
        {isOpen && (
          <div className="border-b border-border p-3 bg-secondary/30 flex gap-2">
            <button
              onClick={copyToClipboard}
              className="flex-1 px-4 py-2 bg-accent text-accent-foreground font-sans text-sm font-medium hover:bg-accent/90 transition-colors"
            >
              Copy Settings Code
            </button>
            <button
              onClick={() => setShowCode(!showCode)}
              className="px-4 py-2 border border-border bg-background font-sans text-sm hover:bg-secondary/50 transition-colors"
            >
              {showCode ? "Hide" : "View"} Code
            </button>
          </div>
        )}

        {/* Code Preview */}
        {isOpen && showCode && (
          <div className="border-b border-border p-4 bg-muted/20 max-h-64 overflow-y-auto">
            <pre className="font-mono text-xs text-foreground whitespace-pre-wrap break-all">
              {generateCode()}
            </pre>
          </div>
        )}

        {/* Collapsible Content */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-border overflow-y-auto flex-1"
            >
              <div className="p-4 space-y-6 pb-6">

                {/* Image Transitions */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-sans text-sm">Picture Changes</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-xs">
                            Controls whether the background image smoothly changes when you scroll to a different poem.
                            <br /><br />
                            <strong>Location:</strong> The large picture on the left side (desktop) or top of the screen (mobile).
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Switch
                      checked={config.imageTransitions}
                      onCheckedChange={(checked) => updateConfig("imageTransitions", checked)}
                    />
                  </div>
                </div>

                {/* Image Fade Speed */}
                {config.imageTransitions && (
                  <>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-sans text-sm">Duration</span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p className="text-xs">
                                How long the picture transition takes. Slower creates a more gentle, cinematic fade. Faster makes it snappier and more responsive.
                                <br /><br />
                                <strong>Location:</strong> Background picture area when scrolling between poems.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <span className="font-sans text-sm font-medium text-accent">{config.imageFadeSpeed.toFixed(1)}s</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-sans text-xs text-muted-foreground w-12">0.3s</span>
                        <Slider
                          value={[config.imageFadeSpeed]}
                          onValueChange={([value]) => updateConfig("imageFadeSpeed", value)}
                          min={0.3}
                          max={3}
                          step={0.1}
                          className="flex-1"
                        />
                        <span className="font-sans text-xs text-muted-foreground w-12 text-right">3.0s</span>
                      </div>
                    </div>

                    {/* Transition Mode */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-sans text-sm">Blend Mode</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="text-xs">
                              How images transition from one to another:
                              <br /><br />
                              <strong>Crossfade:</strong> Images overlap and blend (smoothest)
                              <br />
                              <strong>Fade Through:</strong> Brief moment showing background
                              <br />
                              <strong>Wait:</strong> Complete fade out before fade in
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <select
                        value={config.imageTransitionMode}
                        onChange={(e) => updateConfig("imageTransitionMode", e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-border font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                      >
                        {transitionModeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label} - {option.description}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Image Easing */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-sans text-sm">Easing</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="text-xs">
                              Controls how the animation accelerates and decelerates, like animation curves in After Effects.
                              <br /><br />
                              <strong>Location:</strong> Affects the feel of picture transitions.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <select
                        value={config.imageEasing}
                        onChange={(e) => updateConfig("imageEasing", e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-border font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                      >
                        {easingOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label} - {option.description}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Image Scale Effect */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-sans text-sm">Scale Effect</span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p className="text-xs">
                                Makes the picture slightly zoom in or out during transitions, creating a parallax or "Ken Burns" effect.
                                <br /><br />
                                <strong>Location:</strong> Background picture during transitions.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <Switch
                          checked={config.imageScale}
                          onCheckedChange={(checked) => updateConfig("imageScale", checked)}
                        />
                      </div>
                    </div>

                    {/* Image Scale Amount */}
                    {config.imageScale && (
                      <div className="space-y-2 pl-4 border-l-2 border-accent/20">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-sans text-sm">Scale Amount</span>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p className="text-xs">
                                  How much the picture zooms during transitions. Subtle values (1.05) are more elegant, larger values (1.2) are more dramatic.
                                  <br /><br />
                                  <strong>1.0</strong> = No zoom
                                  <br />
                                  <strong>1.1</strong> = 10% zoom
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <span className="font-sans text-sm font-medium text-accent">{config.imageScaleAmount.toFixed(2)}x</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-sans text-xs text-muted-foreground w-12">1.0</span>
                          <Slider
                            value={[config.imageScaleAmount]}
                            onValueChange={([value]) => updateConfig("imageScaleAmount", value)}
                            min={1.0}
                            max={1.3}
                            step={0.01}
                            className="flex-1"
                          />
                          <span className="font-sans text-xs text-muted-foreground w-12 text-right">1.3</span>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Poem Fade Effect */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-sans text-sm">Poem Highlighting</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-xs">
                            Makes the current poem you're reading appear brighter and clearer, while other poems become slightly faded and blurred.
                            <br /><br />
                            <strong>Location:</strong> The text poems on the right side (desktop) or scrolling area (mobile).
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Switch
                      checked={config.poemFadeEffect}
                      onCheckedChange={(checked) => updateConfig("poemFadeEffect", checked)}
                    />
                  </div>
                </div>

                {/* Poem Transition Speed */}
                {config.poemFadeEffect && (
                  <div className="space-y-2 pl-4 border-l-2 border-accent/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-sans text-sm">Highlight Speed</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="text-xs">
                              How quickly poems fade in and out as you scroll. Slower feels more dreamy and gradual, faster is more responsive.
                              <br /><br />
                              <strong>Location:</strong> Affects poem text opacity/blur transitions.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <span className="font-sans text-sm font-medium text-accent">{(config.poemTransitionSpeed / 1000).toFixed(1)}s</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-sans text-xs text-muted-foreground w-12">0.3s</span>
                      <Slider
                        value={[config.poemTransitionSpeed]}
                        onValueChange={([value]) => updateConfig("poemTransitionSpeed", value)}
                        min={300}
                        max={1500}
                        step={100}
                        className="flex-1"
                      />
                      <span className="font-sans text-xs text-muted-foreground w-12 text-right">1.5s</span>
                    </div>
                  </div>
                )}

                {/* Fine-tune Inactive Poem Opacity */}
                {config.poemFadeEffect && (
                  <div className="space-y-2 pl-4 border-l-2 border-accent/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-sans text-sm">Inactive Opacity</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="text-xs">
                              How faded inactive poems appear. Lower = more dramatic contrast, Higher = more subtle.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <span className="font-sans text-sm font-medium text-accent">{(config.poemOpacityInactive * 100).toFixed(0)}%</span>
                    </div>
                    <Slider
                      value={[config.poemOpacityInactive]}
                      onValueChange={([value]) => updateConfig("poemOpacityInactive", value)}
                      min={0.1}
                      max={0.8}
                      step={0.05}
                      className="flex-1"
                    />
                  </div>
                )}

                {/* Fine-tune Inactive Poem Blur */}
                {config.poemFadeEffect && (
                  <div className="space-y-2 pl-4 border-l-2 border-accent/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-sans text-sm">Inactive Blur</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="text-xs">
                              How blurred inactive poems appear. Creates depth-of-field effect.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <span className="font-sans text-sm font-medium text-accent">{config.poemBlurInactive.toFixed(1)}px</span>
                    </div>
                    <Slider
                      value={[config.poemBlurInactive]}
                      onValueChange={([value]) => updateConfig("poemBlurInactive", value)}
                      min={0}
                      max={4}
                      step={0.5}
                      className="flex-1"
                    />
                  </div>
                )}

                {/* Fine-tune Inactive Poem Scale */}
                {config.poemFadeEffect && (
                  <div className="space-y-2 pl-4 border-l-2 border-accent/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-sans text-sm">Inactive Scale</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="text-xs">
                              Slightly shrinks inactive poems. Creates perspective depth.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <span className="font-sans text-sm font-medium text-accent">{(config.poemScaleInactive * 100).toFixed(0)}%</span>
                    </div>
                    <Slider
                      value={[config.poemScaleInactive]}
                      onValueChange={([value]) => updateConfig("poemScaleInactive", value)}
                      min={0.92}
                      max={1.0}
                      step={0.01}
                      className="flex-1"
                    />
                  </div>
                )}

                {/* Divider for Typography Section */}
                <div className="border-t border-border pt-4">
                  <h3 className="font-sans text-xs font-bold tracking-widest text-accent uppercase mb-4">Typography</h3>
                </div>

                {/* Line Height */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-sans text-sm">Line Spacing</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-xs">
                          Vertical space between lines of poetry. Affects reading rhythm and visual density.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <select
                    value={config.textLineHeight}
                    onChange={(e) => updateConfig("textLineHeight", e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                  >
                    {lineHeightOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label} - {option.description}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Title Font Weight */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-sans text-sm">Title Weight</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-xs">
                          How bold the poem titles appear. Lighter feels delicate, bolder commands attention.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <select
                    value={config.titleFontWeight}
                    onChange={(e) => updateConfig("titleFontWeight", e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                  >
                    {fontWeightOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Body Font Size */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-sans text-sm">Body Size</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-xs">
                            The size of the poem text. Affects readability and visual hierarchy.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <span className="font-sans text-sm font-medium text-accent">{config.bodyFontSize}px</span>
                  </div>
                  <Slider
                    value={[config.bodyFontSize]}
                    onValueChange={([value]) => updateConfig("bodyFontSize", value)}
                    min={16}
                    max={28}
                    step={1}
                    className="flex-1"
                  />
                </div>

                {/* Letter Spacing */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-sans text-sm">Letter Spacing</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-xs">
                            Space between individual letters. Tighter feels classic, wider feels modern and airy.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <span className="font-sans text-sm font-medium text-accent">{config.textLetterSpacing.toFixed(2)}em</span>
                  </div>
                  <Slider
                    value={[config.textLetterSpacing]}
                    onValueChange={([value]) => updateConfig("textLetterSpacing", value)}
                    min={-0.02}
                    max={0.1}
                    step={0.005}
                    className="flex-1"
                  />
                </div>

                {/* Divider for Visual Elements */}
                <div className="border-t border-border pt-4">
                  <h3 className="font-sans text-xs font-bold tracking-widest text-accent uppercase mb-4">Visual Elements</h3>
                </div>

                {/* Image Opacity */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-sans text-sm">Image Opacity</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-xs">
                            Overall transparency of background images. Lower creates more subtle mood.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <span className="font-sans text-sm font-medium text-accent">{(config.imageOpacity * 100).toFixed(0)}%</span>
                  </div>
                  <Slider
                    value={[config.imageOpacity]}
                    onValueChange={([value]) => updateConfig("imageOpacity", value)}
                    min={0.3}
                    max={1.0}
                    step={0.05}
                    className="flex-1"
                  />
                </div>

                {/* Image Blur */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-sans text-sm">Image Softness</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-xs">
                            Softens background images with blur. Creates dreamy, less distracting atmosphere.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <span className="font-sans text-sm font-medium text-accent">{config.imageBlur.toFixed(0)}px</span>
                  </div>
                  <Slider
                    value={[config.imageBlur]}
                    onValueChange={([value]) => updateConfig("imageBlur", value)}
                    min={0}
                    max={20}
                    step={1}
                    className="flex-1"
                  />
                </div>

                {/* Date Uppercase */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-sans text-sm">Uppercase Dates</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-xs">
                            Whether poem dates appear in all caps. Uppercase feels more formal and editorial.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Switch
                      checked={config.dateUppercase}
                      onCheckedChange={(checked) => updateConfig("dateUppercase", checked)}
                    />
                  </div>
                </div>

                {/* Show Divider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-sans text-sm">Title Divider</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-xs">
                            Shows a horizontal line between the title and poem body. Adds formal structure.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Switch
                      checked={config.showDivider}
                      onCheckedChange={(checked) => updateConfig("showDivider", checked)}
                    />
                  </div>
                </div>

                {/* Border Opacity */}
                {config.showDivider && (
                  <div className="space-y-2 pl-4 border-l-2 border-accent/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-sans text-sm">Divider Opacity</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="text-xs">
                              How visible the divider line is. Subtle lines feel elegant, bolder lines create structure.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <span className="font-sans text-sm font-medium text-accent">{(config.borderOpacity * 100).toFixed(0)}%</span>
                    </div>
                    <Slider
                      value={[config.borderOpacity]}
                      onValueChange={([value]) => updateConfig("borderOpacity", value)}
                      min={0.1}
                      max={1.0}
                      step={0.05}
                      className="flex-1"
                    />
                  </div>
                )}

                {/* Smooth Scrolling */}
                <div className="border-t border-border pt-4">
                  <h3 className="font-sans text-xs font-bold tracking-widest text-accent uppercase mb-4">Interaction</h3>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-sans text-sm">Smooth Scrolling</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-xs">
                            When you click "Back to Top", the page will glide smoothly to the top instead of jumping instantly.
                            <br /><br />
                            <strong>Location:</strong> Affects the "Back to Top" button at the bottom of the page.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Switch
                      checked={config.smoothScrolling}
                      onCheckedChange={(checked) => updateConfig("smoothScrolling", checked)}
                    />
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
