<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Custom User Rules

1. **Next.js & Rendering**: Utilize Next.js capabilities effectively. Prioritize Server-Side Rendering (SSR) for fast initial load ("first come"), and use Client-Side Rendering (CSR) for interactive parts.
2. **Image Optimization**: Ensure images are optimized and load very quickly.
3. **Code Quality & Structure**: Maintain a strictly good code structure across the project.
4. **Modular Code (No Huge Files)**: Do not create massive files. Break down complex logic and large codeblocks into smaller, modular, and maintainable files.
5. **UI Library**: **Must use shadcn/ui for all components**. Colors must be set up professionally and consistently using the shadcn/ui theme system.
