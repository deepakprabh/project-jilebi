#!/usr/bin/env node
// Re-encode JPEGs in public/ to reasonable web sizes.
// Run: node scripts/optimize-images.mjs

import { readdir, stat, rename, unlink } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..', 'public')
const MAX_WIDTH = 1920
const QUALITY = 78

async function walk(dir) {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await walk(full)))
    else if (/\.(jpe?g)$/i.test(entry.name)) out.push(full)
  }
  return out
}

function fmt(bytes) {
  return `${(bytes / 1024).toFixed(0)} KB`
}

const files = await walk(ROOT)
let totalIn = 0
let totalOut = 0

for (const file of files) {
  const before = (await stat(file)).size
  const tmp = `${file}.tmp`
  await sharp(file)
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true, progressive: true })
    .toFile(tmp)
  const after = (await stat(tmp)).size
  if (after < before) {
    await rename(tmp, file)
    totalIn += before
    totalOut += after
    console.log(`${file}: ${fmt(before)} → ${fmt(after)}`)
  } else {
    await unlink(tmp)
    console.log(`${file}: skipped (re-encode was larger)`)
  }
}

console.log(`\nTotal: ${fmt(totalIn)} → ${fmt(totalOut)} (${((1 - totalOut / totalIn) * 100).toFixed(1)}% smaller)`)
