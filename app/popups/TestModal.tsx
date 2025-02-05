import { Modal } from "@/app/ui/components/Modal"
import { Text } from "@/app/ui/components/nativewindui/Text"

export const TestModal = () => {
  return (
    <Modal visible={true} onClose={() => {}}>
      <Text>Hello</Text>
    </Modal>
  )
}
