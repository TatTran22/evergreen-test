import ProfileCard from '../components/ProfileCard'
import { Profile } from '../lib/constants'
import { supabase } from '../lib/supabaseClient'
import { useEffect, useReducer } from 'react'
import { Pane, Text } from 'evergreen-ui'

/**
 * Since we want this component to update in realtime,
 * we should use "useReducer" for sending Realtime events
 */

type State = {
  profiles: Profile[]
}
type Action = {
  type?: string
  payload: any
}
type ProfileListProps = {
  profiles: Profile[]
}

const handleDatabaseEvent = (state: State, action: Action) => {
  if (action.type === 'upsert') {
    const otherProfiles = state.profiles.filter((x) => x.id != action.payload.id)
    return {
      profiles: [action.payload, ...otherProfiles],
    }
  } else if (action.type === 'set') {
    return {
      profiles: action.payload,
    }
  }
  return { profiles: [] }
}

export default function ProfileList({ profiles }: ProfileListProps) {
  const initialState: State = { profiles }
  const [state, dispatch] = useReducer(handleDatabaseEvent, initialState)

  useEffect(() => {
    const subscription = supabase
      .from('profiles')
      .on('*', (payload) => {
        dispatch({ type: 'upsert', payload: payload.new })
      })
      .subscribe()

    return () => {
      supabase.removeSubscription(subscription)
    }
  }, [])

  useEffect(() => {
    dispatch({ type: 'set', payload: profiles })
  }, [profiles])

  return (
    <Pane>
      {state.profiles.length === 0 ? (
        <Text className="opacity-half font-light m-0">There are no public profiles created yet</Text>
      ) : (
        <Pane>
          {state.profiles?.map((profile: Profile) => (
            <ProfileCard profile={profile} key={profile.id} />
          ))}
        </Pane>
      )}
    </Pane>
  )
}
