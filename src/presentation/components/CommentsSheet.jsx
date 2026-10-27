import styled from '@emotion/styled'
import { useState } from 'react'
import { IconClose, IconSend } from '../../icons.jsx'

const Backdrop = styled.div`
  position: fixed; inset: 0; z-index: 60; background: ${(p) => p.theme.colors.overlay};
  display: flex; align-items: flex-end; justify-content: center;
`
const Sheet = styled.section`
  width: 100%; max-width: ${(p) => p.theme.phone}px; max-height: 88dvh; overflow-y: auto;
  background: ${(p) => p.theme.colors.surface}; border-radius: ${(p) => p.theme.radius.lg}px ${(p) => p.theme.radius.lg}px 0 0;
  padding: ${(p) => p.theme.space.lg}px; position: relative;
`
const Close = styled.button`
  position: absolute; top: ${(p) => p.theme.space.md}px; right: ${(p) => p.theme.space.md}px;
  width: 44px; height: 44px; border-radius: 50%; border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface2}; color: ${(p) => p.theme.colors.text}; display: grid; place-items: center;
`
const H2 = styled.h2`margin: 0; font-size: ${(p) => p.theme.font.title}px;`
const Meta = styled.p`color: ${(p) => p.theme.colors.muted}; font-size: ${(p) => p.theme.font.sm}px; margin: ${(p) => p.theme.space.sm}px 0 ${(p) => p.theme.space.md}px;`
const List = styled.div`display: flex; flex-direction: column; gap: ${(p) => p.theme.space.md}px; margin: ${(p) => p.theme.space.md}px 0;`
const Item = styled.div`display: flex; gap: ${(p) => p.theme.space.sm}px;`
const Avatar = styled.div`
  width: 40px; height: 40px; min-width: 40px; border-radius: 50%; background: ${(p) => p.theme.colors.surface2};
  display: grid; place-items: center; font-weight: 900;
`
const CommentText = styled.div`b { font-size: ${(p) => p.theme.font.base}px; } p { margin: 2px 0 0; font-size: ${(p) => p.theme.font.base}px; color: rgba(255,255,255,0.85); }`
const Form = styled.form`display: flex; gap: ${(p) => p.theme.space.sm}px; position: sticky; bottom: 0; background: ${(p) => p.theme.colors.surface}; padding: ${(p) => p.theme.space.sm}px 0;`
const Input = styled.input`
  flex: 1; min-height: ${(p) => p.theme.touch}px; border-radius: ${(p) => p.theme.radius.pill}px;
  border: 1px solid ${(p) => p.theme.colors.border}; background: ${(p) => p.theme.colors.surface2}; color: ${(p) => p.theme.colors.text};
  padding: 0 ${(p) => p.theme.space.lg}px; font-size: ${(p) => p.theme.font.base}px;
`
const Send = styled.button`
  width: ${(p) => p.theme.touch}px; height: ${(p) => p.theme.touch}px; border-radius: 50%; border: none;
  background: linear-gradient(135deg, ${(p) => p.theme.colors.accent}, ${(p) => p.theme.colors.accent2});
  color: ${(p) => p.theme.colors.white}; display: grid; place-items: center;
`

export default function CommentsSheet({ episode, title, comments, onClose, onAdd }) {
  const [text, setText] = useState('')
  return (
    <Backdrop onClick={onClose}>
      <Sheet onClick={(e) => e.stopPropagation()}>
        <Close onClick={onClose} aria-label="Tutup"><IconClose /></Close>
        <H2>Komentar</H2>
        <Meta>{title} — Episode {episode.ep}</Meta>
        <List>
          {comments.map((c, i) => (
            <Item key={i}><Avatar>{c.user[0]}</Avatar><CommentText><b>{c.user}</b><p>{c.text}</p></CommentText></Item>
          ))}
        </List>
        <Form onSubmit={(e) => { e.preventDefault(); onAdd(text); setText('') }}>
          <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Tulis komentar…" />
          <Send type="submit" aria-label="Kirim komentar"><IconSend /></Send>
        </Form>
      </Sheet>
    </Backdrop>
  )
}
