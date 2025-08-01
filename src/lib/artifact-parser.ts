export interface ParsedArtifact {
  id: string;
  type: 'code' | 'html' | 'markdown' | 'text';
  language?: string;
  title: string;
  content: string;
  startIndex: number;
  endIndex: number;
}

export const parseArtifacts = (text: string): { artifacts: ParsedArtifact[], cleanText: string } => {
  const artifacts: ParsedArtifact[] = [];
  
  // Regex pour capturer les artifacts avec attributs optionnels
  const artifactRegex = /<artifact\s+(?:id="([^"]*)")?\s*(?:type="([^"]*)")?\s*(?:language="([^"]*)")?\s*(?:title="([^"]*)")?\s*>([\s\S]*?)<\/artifact>/gi;
  
  let match;
  let cleanText = text;
  const replacements: Array<{ original: string; replacement: string; start: number; end: number }> = [];
  
  // Réinitialiser l'index du regex
  artifactRegex.lastIndex = 0;
  
  while ((match = artifactRegex.exec(text)) !== null) {
    const [fullMatch, id, type, language, title, content] = match;
    const startIndex = match.index;
    const endIndex = match.index + fullMatch.length;
    
    // Valeurs par défaut
    const artifactId = id || `artifact-${artifacts.length + 1}`;
    const artifactType = (type as 'code' | 'html' | 'markdown' | 'text') || 'code';
    const artifactTitle = title || `${artifactType.charAt(0).toUpperCase() + artifactType.slice(1)} Snippet`;
    const cleanContent = content?.trim() || '';
    
    artifacts.push({
      id: artifactId,
      type: artifactType,
      language: language || (artifactType === 'code' ? 'javascript' : undefined),
      title: artifactTitle,
      content: cleanContent,
      startIndex,
      endIndex
    });
    
    // Préparer le remplacement
    const placeholder = `\n\n[🔧 Artifact: ${artifactTitle}]\n\n`;
    replacements.push({
      original: fullMatch,
      replacement: placeholder,
      start: startIndex,
      end: endIndex
    });
  }
  
  // Appliquer les remplacements en ordre inverse pour préserver les indices
  replacements
    .sort((a, b) => b.start - a.start)
    .forEach(({ original, replacement }) => {
      cleanText = cleanText.replace(original, replacement);
    });
  
  return { artifacts, cleanText };
};

// Fonction utilitaire pour détecter si un texte contient des artifacts
export const hasArtifacts = (text: string): boolean => {
  const artifactRegex = /<artifact[\s\S]*?<\/artifact>/gi;
  return artifactRegex.test(text);
};

// Fonction pour valider un artifact
export const validateArtifact = (artifact: Partial<ParsedArtifact>): boolean => {
  return !!(
    artifact.content &&
    artifact.content.trim().length > 0 &&
    artifact.type &&
    ['code', 'html', 'markdown', 'text'].includes(artifact.type)
  );
};
